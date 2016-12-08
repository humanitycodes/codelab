import Vue from 'vue'
import flatten from 'lodash/flatten'
import mapAndMerge from './utils/map-and-merge'

import resourceDefs from './defs/resources'
const resourceNames = Object.keys(resourceDefs)

const singularize = word => {
  return word.slice(0, word.length - 1)
}
const capitalize = word => {
  return word[0].toUpperCase() + word.slice(1, word.length)
}

export default (store, db, uid, roles) => {
  // In case there are no roles because no user is signed in
  roles = roles || {}
  // Cache to keep track of which firebase stuff we've already synced
  const alreadySyncedCache = {}
  return {
    state: {
      ...mapAndMerge(resourceNames, resourceName => {
        return {
          [`raw-${resourceName}`]: {}
        }
      })
    },
    getters: {
      // For each resource defined in defs/resources
      ...mapAndMerge(resourceNames, resourceName => {
        const singularResourceName = singularize(resourceName)
        const currentResourceName = 'current' + capitalize(singularResourceName)
        const currentResourcePathName = capitalize(`${currentResourceName}Path`)
        return {
          // E.g. "lessons"
          [resourceName] (state, getters, rootState) {
            const resourceArray = []
            const stateDefs = state[`raw-${resourceName}`]
            const resourceKeys = Object.keys(stateDefs)
            // For each of the keys that we want to fetch information for
            resourceKeys.forEach((resourceKey, resourceIndex) => {
              const resourceItem = {}
              // Define the key as read-only
              Object.defineProperty(resourceItem, '.key', {
                value: resourceKey
              })
              // Define the meta fields as read-only
              const meta = stateDefs[resourceKey].meta || {}
              const metaFields = Object.keys(meta)
              metaFields.forEach(metaField => {
                Object.defineProperty(resourceItem, '.' + metaField, {
                  value: meta[metaField]
                })
              })
              // Define relationships as read-only
              const relationships = resourceDefs[resourceName].relationships || {}
              const relationshipNames = Object.keys(relationships)
              relationshipNames.forEach(relationshipName => {
                const relationshipDef = typeof relationships[relationshipName] === 'object'
                  ? relationships[relationshipName]
                  : {}
                Object.defineProperty(
                  resourceItem,
                  `${singularize(relationshipName)}Keys`,
                  {
                    value: Object.keys(
                      (
                        stateDefs[resourceKey].relationships &&
                        stateDefs[resourceKey].relationships[relationshipName]
                      ) || {}
                    ),
                    enumerable: true
                  }
                )
                // !!! Abort (don't create add/remove relationship methods) if the course is derived
                if (relationshipDef.derivedFrom) return

                const relatedResourceName = relationshipDef.resource
                  ? relationshipDef.resource
                  : relationshipName
                const resourceForeignKey = relationshipDef.foreignKey
                  ? relationshipDef.foreignKey
                  : resourceName
                // Scan all resources for values derived from this relationship
                const updatesToTrigger = []
                resourceNames.forEach(otherResourceName => {
                  // Abort immediately if the resource is self, because there
                  // will never be a need to derive a relationship from another
                  // relationship on the same resource
                  if (otherResourceName === resourceName) return
                  const otherResourceRelationships = resourceDefs[otherResourceName].relationships
                  const otherResourceRelationshipNames = Object.keys(otherResourceRelationships)
                  otherResourceRelationshipNames.forEach(otherRelationshipName => {
                    const otherRelationshipDef = typeof otherResourceRelationships[otherRelationshipName] === 'object'
                      ? otherResourceRelationships[otherRelationshipName]
                      : {}
                    if (otherRelationshipDef.derivedFrom) {
                      const derivedDef = otherRelationshipDef.derivedFrom
                      const originResource = derivedDef.resource
                      const originRelationship = derivedDef.relationship || otherRelationshipName
                      const dependentForeignKey = derivedDef.foreignKey || otherResourceName
                      // E.g. If we're building relationships for courses and
                      // find this when scanning lessons:
                      //     lessons: {
                      //       relationships: {
                      //         students: {
                      //           derivedFrom: { resource: 'courses' }
                      //         }
                      //       }
                      //     }
                      // Then the resource name "courses" will match our own
                      if (originResource === resourceName) {
                        // e.g. When building course "students" relationship...
                        if (originRelationship === relationshipName) {
                          updatesToTrigger.push({
                            type: 'SELF_TO_MANY',
                            sourceRelationship: dependentForeignKey,  // e.g. "lessons"
                            targetResource: otherResourceName,        // e.g. "lessons"
                            targetRelationship: otherRelationshipName // e.g. "students"
                          })
                        }
                        // e.g. When building course "lessons" relationship...
                        if (dependentForeignKey === relationshipName) {
                          updatesToTrigger.push({
                            type: 'MANY_TO_SELF',
                            sourceRelationship: originRelationship,   // e.g. "students"
                            targetRelationship: otherRelationshipName // e.g. "students"
                          })
                        }
                      }
                    }
                  })
                })

                const singularRelatedResourceName = singularize(relationshipName)
                const addRelatedResourceName = 'add' + capitalize(singularRelatedResourceName)
                // Define "add" method for the relationship
                // E.g. course.addLesson(lessonKey)
                resourceItem[addRelatedResourceName] = function (relatedResourceKey) {
                  const firebaseActions = []
                  // Add relationship with meta keys to current record
                  firebaseActions.push(
                    db.ref(`${resourceName}/relationships`)
                      .child(resourceKey)
                      .child(relationshipName)
                      .child(relatedResourceKey)
                      .child('createdAt')
                      .set(Date.now())
                  )
                  firebaseActions.push(
                    db.ref(`${resourceName}/relationships`)
                      .child(resourceKey)
                      .child(relationshipName)
                      .child(relatedResourceKey)
                      .child('createdBy')
                      .set(uid)
                  )
                  // If the resource is listed in defs/resources, add
                  // the relationship there as well to create a two-way
                  // relationship (i.e. many-to-many)
                  // E.g. When you add a lesson to a course, you are
                  // also adding that course to the lesson
                  if (resourceNames.indexOf(relatedResourceName) !== -1) {
                    firebaseActions.push(
                      db.ref(`${relatedResourceName}/relationships`)
                        .child(relatedResourceKey)
                        .child(resourceForeignKey)
                        .child(resourceKey)
                        .child('createdAt')
                        .set(Date.now())
                    )
                    firebaseActions.push(
                      db.ref(`${relatedResourceName}/relationships`)
                        .child(relatedResourceKey)
                        .child(resourceForeignKey)
                        .child(resourceKey)
                        .child('createdBy')
                        .set(uid)
                    )
                  }
                  return Promise.all(firebaseActions).then(() => {
                    return updatesToTrigger.map(updateDef => {
                      const sourceRelationshipKeys = Object.keys(
                        stateDefs[resourceKey].relationships[updateDef.sourceRelationship]
                      )
                      if (updateDef.type === 'SELF_TO_MANY') {
                        return Promise.all(
                          sourceRelationshipKeys.map(sourceRelationshipKey => {
                            return Promise.all([
                              db.ref(updateDef.targetResource + '/relationships')
                                .child(sourceRelationshipKey)
                                .child(updateDef.targetRelationship)
                                .child(relatedResourceKey)
                                .child(resourceName)
                                .child(resourceKey)
                                .child('createdAt')
                                .set(Date.now()),
                              db.ref(updateDef.targetResource + '/relationships')
                                .child(sourceRelationshipKey)
                                .child(updateDef.targetRelationship)
                                .child(relatedResourceKey)
                                .child(resourceName)
                                .child(resourceKey)
                                .child('createdBy')
                                .set(uid)
                            ])
                          })
                        )
                      } else if (updateDef.type === 'MANY_TO_SELF') {
                        return Promise.all(
                          sourceRelationshipKeys.map(sourceRelationshipKey => {
                            return Promise.all([
                              db.ref(relatedResourceName + '/relationships')
                                .child(relatedResourceKey)
                                .child(updateDef.targetRelationship)
                                .child(sourceRelationshipKey)
                                .child(resourceName)
                                .child(resourceKey)
                                .child('createdAt')
                                .set(Date.now()),
                              db.ref(relatedResourceName + '/relationships')
                                .child(relatedResourceKey)
                                .child(updateDef.targetRelationship)
                                .child(sourceRelationshipKey)
                                .child(resourceName)
                                .child(resourceKey)
                                .child('createdBy')
                                .set(uid)
                            ])
                          })
                        )
                      } else {
                        throw new Error(`Bad relationship update trigger type: ${updateDef.type}. Acceptable values are "SELF_TO_MANY" and "MANY_TO_SELF".`)
                      }
                    })
                  })
                }
                // Define "remove" method for the relationship
                // E.g. course.removeLesson(lessonKey)
                const removeRelatedResourceName = 'remove' + capitalize(singularRelatedResourceName)
                resourceItem[removeRelatedResourceName] = function (relatedResourceKey) {
                  const firebaseActions = []
                  // Remove relationship from the current record
                  firebaseActions.push(
                    db.ref(`${resourceName}/relationships`)
                      .child(resourceKey)
                      .child(relationshipName)
                      .child(relatedResourceKey)
                      .remove()
                  )
                  // If the resource is listed in defs/resources, remove
                  // the relationship there as well to end a two-way
                  // relationship (i.e. many-to-many)
                  // E.g. When you remove a lesson from a course, you are
                  // also removing that course from the lesson
                  if (resourceNames.indexOf(relatedResourceName) !== -1) {
                    firebaseActions.push(
                      db.ref(`${relatedResourceName}/relationships`)
                        .child(relatedResourceKey)
                        .child(resourceForeignKey)
                        .child(resourceKey)
                        .remove()
                    )
                  }
                  return Promise.all(firebaseActions).then(() => {
                    return updatesToTrigger.map(updateDef => {
                      const sourceRelationshipKeys = Object.keys(
                        state[`raw-${resourceName}`][resourceKey]
                          .relationships[updateDef.sourceRelationship]
                      )
                      if (updateDef.type === 'SELF_TO_MANY') {
                        return Promise.all(
                          sourceRelationshipKeys.map(sourceRelationshipKey => {
                            return db.ref(updateDef.targetResource + '/relationships')
                              .child(sourceRelationshipKey)
                              .child(updateDef.targetRelationship)
                              .child(relatedResourceKey)
                              .child(resourceName)
                              .child(resourceKey)
                              .remove()
                          })
                        )
                      } else if (updateDef.type === 'MANY_TO_SELF') {
                        return Promise.all(
                          sourceRelationshipKeys.map(sourceRelationshipKey => {
                            return db.ref(relatedResourceName + '/relationships')
                              .child(relatedResourceKey)
                              .child(updateDef.targetRelationship)
                              .child(sourceRelationshipKey)
                              .child(resourceName)
                              .child(resourceKey)
                              .remove()
                          })
                        )
                      } else {
                        throw new Error(`Bad relationship update trigger type: ${updateDef.type}. Acceptable values are "SELF_TO_MANY" and "MANY_TO_SELF".`)
                      }
                    })
                  })
                }
              })
              const sizeDef = resourceDefs[resourceName].fieldGroups
              const sizeNames = Object.keys(sizeDef)
              // Loop through any possible sizes for that resource
              // E.g. small, large
              sizeNames.forEach(sizeName => {
                const groupDef = sizeDef[sizeName]
                const groupNames = Object.keys(groupDef)
                // Loop through any possible field groups for that resource
                // E.g. authed, student, instructor
                groupNames.forEach(groupName => {
                  const fields = groupDef[groupName]
                  const fieldNames = Object.keys(fields)
                  // Loop through any possible fields for that resource
                  // E.g. title, syllabus
                  fieldNames.forEach(fieldName => {
                    // Get the value that we have stored locally
                    // in our state, if any for that field
                    const fieldValue = (
                      stateDefs[resourceKey][sizeName] &&
                      stateDefs[resourceKey][sizeName][groupName] &&
                      stateDefs[resourceKey][sizeName][groupName][fieldName]
                    ) || undefined
                    // Define the field as on the item/record, with a setter
                    // that actually updates the field in Firebase, yo!!!
                    Object.defineProperty(resourceItem, fieldName, {
                      get: () => fieldValue,
                      set (newValue) {
                        db.ref(`${resourceName}/fieldGroups`)
                          .child(sizeName)
                          .child(groupName)
                          .child(resourceKey)
                          .child(fieldName)
                          .set(newValue)
                        db.ref(resourceName)
                          .child('meta')
                          .child(resourceKey)
                          .child('updatedAt')
                          .set(Date.now())
                        db.ref(resourceName)
                          .child('meta')
                          .child(resourceKey)
                          .child('updatedBy')
                          .set(uid)
                      },
                      enumerable: true
                    })
                  })
                })
              })
              // The item/record is done being built, add it to the resourceArray
              resourceArray.push(resourceItem)
            })
            // Creates a new record in Firebase with a key
            // E.g. lessons.add(lessonKey)
            resourceArray.add = function (itemKey) {
              // Initialize record with metadata
              return Promise.all([
                db.ref(resourceName)
                  .child('meta')
                  .child(itemKey)
                  .child('createdAt')
                  .set(Date.now()),
                db.ref(resourceName)
                  .child('meta')
                  .child(itemKey)
                  .child('createdBy')
                  .set(uid)
              ])
            }
            // Deletes an existing record in Firebase with a key
            // E.g. lessons.remove(lessonKey)
            resourceArray.remove = function (itemKey) {
              const firebaseActions = []
              // Delete metadata for record in Firebase
              firebaseActions.push(
                db.ref(resourceName)
                  .child('meta')
                  .child(itemKey)
                  .remove()
              )
              // Delete all fields for a record in Firebase
              const sizes = resourceDefs[resourceName].fieldGroups
              const sizeNames = Object.keys(sizes)
              sizeNames.forEach(sizeName => {
                const groups = sizes[sizeName]
                const groupNames = Object.keys(groups)
                groupNames.forEach(groupName => {
                  firebaseActions.push(
                    db.ref(`${resourceName}/fieldGroups`)
                      .child(sizeName)
                      .child(groupName)
                      .child(itemKey)
                      .remove()
                  )
                })
              })
              // TODO: Also delete relationships, by pulling in all
              // relationships of the deleted resource that exist
              // and deleting their inverse
              return Promise.all(firebaseActions)
            }
            return resourceArray
          },
          // E.g. "currentLesson"
          [currentResourceName] (state, getters, rootState) {
            const resourceKey = rootState.route.params[`${singularResourceName}Key`]
            store.dispatch('syncLargeFieldsOfResource', {
              resourceName, resourceKey
            })
            return getters[resourceName].find(resource => {
              return resource['.key'] === resourceKey
            })
          },
          // E.g. "showCurrentLessonPath"
          [`show${currentResourcePathName}`] (state, getters, rootState) {
            const currentResourceKey = getters[currentResourceName]['.key']
            return `/${resourceName}/${currentResourceKey}`
          },
          // E.g. "editCurrentLessonPath"
          [`edit${currentResourcePathName}`] (state, getters, rootState) {
            const currentResourceKey = getters[currentResourceName]['.key']
            return `/${resourceName}/${currentResourceKey}/edit`
          }
        }
      })
    },
    actions: {
      // Sync all the resources except for users and roles
      syncResources ({ rootState, commit }) {
        // Skip syncing if we've already synced once
        if (alreadySyncedCache.allResources) return Promise.resolve()
        alreadySyncedCache.allResources = true
        // For all of the resources defined in defs/resources
        return Promise.all(resourceNames.map(resourceName => {
          // We download all the small fields for every record,
          // but only the small fields, because we it might be a lot of data
          const smallFieldGroups = resourceDefs[resourceName].fieldGroups.small
          const smallFieldGroupNames = Object.keys(smallFieldGroups)
          return new Promise((resolve, reject) => {
            // If no user is signed in, the resource will just be an empty array
            if (!uid) return resolve([])
            // This is where we store the firebase ref for
            // the items/records we'll need to fetch
            let itemsToFetchRef
            if (roles.instructor) {
              // Fetch all existing resources
              itemsToFetchRef = db
                .ref(`${resourceName}/meta`)
            } else {
              // Fetch just the resources the user has access to,
              // if they're not an instructor
              itemsToFetchRef = db
                .ref(`${resourceName}/relationships`)
                .orderByChild(`students/${uid}`)
                // Only include existing values that are not false
                // https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data#orderbychild
                .startAt(true)
            }
            // Fetch all of the keys that we're going to pull in data for
            itemsToFetchRef.once('value', snapshot => {
              const resources = snapshot.val()
              if (!resources) return resolve([])
              const resourceKeys = Object.keys(resources)
              resolve(resourceKeys)
            }, error => {
              throw error
            })
          // For all the records that the user has access to
          }).then(keysToSync => {
            // Select the subset of field groups that the user
            // has access to
            const accessibleFieldGroupNames = smallFieldGroupNames
              .filter(fieldGroupName => {
                return (
                  // Instructors can access all field groups
                  roles.instructor ||
                  // Students can access public, authed, and student fields
                  ['public', 'authed', 'student'].includes(fieldGroupName)
                )
              })
            // Collecting pieces of each record
            return Promise.all(flatten([
              // Collecting all the relationships
              keysToSync.map(resourceKey => {
                const relationshipDefs = resourceDefs[resourceName].relationships
                const relationshipNames = Object.keys(relationshipDefs)
                return Promise.all(
                  relationshipNames.map(relationshipName => {
                    return new Promise((resolve, reject) => {
                      db.ref(`${resourceName}/relationships`)
                        .child(resourceKey)
                        .child(relationshipName)
                        .on('value', snapshot => {
                          commit('SET_RESOURCE_ITEM', {
                            path: `${resourceName}/${resourceKey}/relationships/${relationshipName}`,
                            fields: snapshot.val() || {}
                          })
                          resolve()
                        })
                    })
                  })
                )
              }),
              // Collecting all the meta properties
              keysToSync.map(resourceKey => {
                new Promise((resolve, reject) => {
                  db.ref(`${resourceName}/meta`)
                    .child(resourceKey)
                    .on('value', snapshot => {
                      commit('SET_RESOURCE_ITEM', {
                        path: `${resourceName}/${resourceKey}/meta`,
                        fields: snapshot.val()
                      })
                      resolve()
                    })
                })
              }),
              // Collecting all the small fields
              keysToSync.map(resourceKey => {
                accessibleFieldGroupNames.map(fieldGroupName => {
                  return new Promise((resolve, reject) => {
                    db.ref(`${resourceName}/fieldGroups/small`)
                      .child(fieldGroupName)
                      .child(resourceKey)
                      .on('value', snapshot => {
                        commit('SET_RESOURCE_ITEM', {
                          path: `${resourceName}/${resourceKey}/small/${fieldGroupName}`,
                          fields: snapshot.val()
                        })
                        resolve()
                      })
                  })
                })
              })
            ]))
          })
        }))
      },
      // Lazily sync large fields when we need them
      syncLargeFieldsOfResource ({ commit }, { resourceName, resourceKey }) {
        alreadySyncedCache[resourceName] = alreadySyncedCache[resourceName] || {}
        if (alreadySyncedCache[resourceName][resourceKey]) return
        alreadySyncedCache[resourceName][resourceKey] = true
        const largeFieldGroupNames = Object.keys(resourceDefs[resourceName].fieldGroups.large)
        const accessibleFieldGroupNames = largeFieldGroupNames.filter(fieldGroupName => {
          return (
            // Instructors can access all field groups
            roles.instructor ||
            // Students can access public, authed, and student fields
            ['public', 'authed', 'student'].includes(fieldGroupName)
          )
        })
        accessibleFieldGroupNames.forEach(fieldGroupName => {
          db.ref(`${resourceName}/fieldGroups/large`)
            .child(fieldGroupName)
            .child(resourceKey)
            .on('value', snapshot => {
              commit('SET_RESOURCE_ITEM', {
                path: `${resourceName}/${resourceKey}/large/${fieldGroupName}`,
                fields: snapshot.val()
              })
            })
        })
      }
    },
    mutations: {
      // Store a resource item in a kind of mirror image of how
      // we're storing the data in Firebase. For example, if we
      // have this in Firebase:
      //    /lessons/small/instructor/:lessonsKey
      // Then we would store it locally as:
      //    /lessons/:lessonsKey/small/instructor/
      SET_RESOURCE_ITEM (state, data) {
        const pathSegments = data.path.split('/')
        const stateResource = state[`raw-${pathSegments.shift()}`]
        let stateToUpdate = stateResource
        pathSegments.forEach((pathSegment, index) => {
          if (index < pathSegments.length - 1) {
            Vue.set(
              stateToUpdate,
              pathSegment,
              stateToUpdate[pathSegment] || {}
            )
            stateToUpdate = stateToUpdate[pathSegment]
          } else {
            Vue.set(stateToUpdate, pathSegment, data.fields)
          }
        })
      }
    }
  }
}
