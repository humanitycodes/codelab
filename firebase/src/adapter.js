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
      ...mapAndMerge(resourceNames, resourceName => {
        const singularResourceName = singularize(resourceName)
        const currentResourceName = 'current' + capitalize(singularResourceName)
        const currentResourcePathName = capitalize(`${currentResourceName}Path`)
        return {
          [resourceName] (state, getters, rootState) {
            const resourceArray = []
            const stateDefs = state[`raw-${resourceName}`]
            const resourceKeys = Object.keys(stateDefs)
            resourceKeys.forEach((resourceKey, resourceIndex) => {
              const resourceItem = {}
              Object.defineProperty(resourceItem, '.key', {
                value: resourceKey
              })
              const meta = stateDefs[resourceKey].meta
              const metaFields = Object.keys(meta)
              metaFields.forEach(metaField => {
                Object.defineProperty(resourceItem, '.' + metaField, {
                  value: meta[metaField]
                })
              })
              const { relationships } = resourceDefs[resourceName]
              const relationshipNames = Object.keys(relationships)
              relationshipNames.forEach(relationshipName => {
                const relationshipDef = relationships[relationshipName]
                Object.defineProperty(
                  resourceItem,
                  `${singularize(relationshipName)}Keys`,
                  {
                    value: Object.keys(stateDefs[resourceKey].relationships[relationshipName]),
                    enumerable: true
                  }
                )
                const relatedResourceName = typeof relationshipDef === 'object' && relationshipDef.resource
                  ? relationshipDef.resource
                  : relationshipName
                const resourceForeignKey = typeof relationshipDef === 'object' && relationshipDef.foreignKey
                  ? relationshipDef.foreignKey
                  : resourceName
                const singularRelatedResourceName = singularize(relationshipName)
                const addRelatedResourceName = 'add' + capitalize(singularRelatedResourceName)
                resourceItem[addRelatedResourceName] = function (relatedResourceKey) {
                  db.ref(`${resourceName}/relationships`)
                    .child(resourceKey)
                    .child(relationshipName)
                    .child(relatedResourceKey)
                    .child('createdAt')
                    .set(Date.now())
                  db.ref(`${resourceName}/relationships`)
                    .child(resourceKey)
                    .child(relationshipName)
                    .child(relatedResourceKey)
                    .child('createdBy')
                    .set(uid)
                  const resourceNames = Object.keys(resourceDefs)
                  if (resourceNames.indexOf(relatedResourceName) !== -1) {
                    db.ref(`${relatedResourceName}/relationships`)
                      .child(relatedResourceKey)
                      .child(resourceForeignKey)
                      .child(resourceKey)
                      .child('createdAt')
                      .set(Date.now())
                    db.ref(`${relatedResourceName}/relationships`)
                      .child(relatedResourceKey)
                      .child(resourceForeignKey)
                      .child(resourceKey)
                      .child('createdBy')
                      .set(uid)
                  }
                }
                const removeRelatedResourceName = 'remove' + capitalize(singularRelatedResourceName)
                resourceItem[removeRelatedResourceName] = function (relatedResourceKey) {
                  db.ref(`${resourceName}/relationships`)
                    .child(resourceKey)
                    .child(relationshipName)
                    .child(relatedResourceKey)
                    .remove()
                  const resourceNames = Object.keys(resourceDefs)
                  if (resourceNames.indexOf(relatedResourceName) !== -1) {
                    db.ref(`${relatedResourceName}/relationships`)
                      .child(relatedResourceKey)
                      .child(resourceForeignKey)
                      .child(resourceKey)
                      .remove()
                  }
                }
              })
              const sizeDef = resourceDefs[resourceName].fieldGroups
              const sizeNames = Object.keys(sizeDef)
              sizeNames.forEach(sizeName => {
                const groupDef = sizeDef[sizeName]
                const groupNames = Object.keys(groupDef)
                groupNames.forEach(groupName => {
                  const fields = groupDef[groupName]
                  const fieldNames = Object.keys(fields)
                  fieldNames.forEach(fieldName => {
                    const fieldValue = (
                      stateDefs[resourceKey][sizeName] &&
                      stateDefs[resourceKey][sizeName][groupName] &&
                      stateDefs[resourceKey][sizeName][groupName][fieldName]
                    ) || undefined
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
              resourceArray.push(resourceItem)
            })
            resourceArray.add = function (itemKey) {
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
            resourceArray.remove = function (itemKey) {
              const firebaseActions = []
              firebaseActions.push(
                db.ref(resourceName)
                  .child('meta')
                  .child(itemKey)
                  .remove()
              )
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
              // TODO: Also delete relationships, by pulling in all relationships of the deleted resource that exist and deleting their inverse
              return Promise.all(firebaseActions)
            }
            return resourceArray
          },
          [currentResourceName] (state, getters, rootState) {
            const resourceKey = rootState.route.params[`${singularResourceName}Key`]
            store.dispatch('syncLargeFieldsOfResource', {
              resourceName, resourceKey
            })
            return getters[resourceName].find(resource => {
              return resource['.key'] === resourceKey
            })
          },
          [`show${currentResourcePathName}`] (state, getters, rootState) {
            const currentResourceKey = getters[currentResourceName]['.key']
            return `/${resourceName}/${currentResourceKey}`
          },
          [`edit${currentResourcePathName}`] (state, getters, rootState) {
            const currentResourceKey = getters[currentResourceName]['.key']
            return `/${resourceName}/${currentResourceKey}/edit`
          }
        }
      })
    },
    actions: {
      syncResources ({ rootState, commit }) {
        if (alreadySyncedCache.allResources) return Promise.resolve()
        alreadySyncedCache.allResources = true
        return Promise.all(resourceNames.map(resourceName => {
          const smallFieldGroups = resourceDefs[resourceName].fieldGroups.small
          const smallFieldGroupNames = Object.keys(smallFieldGroups)
          return new Promise((resolve, reject) => {
            if (!uid) return resolve([])
            let itemsToFetchRef
            if (roles.instructor) {
              // Fetch all existing resources
              itemsToFetchRef = db
                .ref(`${resourceName}/meta`)
            } else {
              // Fetch just the resources the user has access to
              itemsToFetchRef = db
                .ref(`${resourceName}/relationships`)
                .orderByChild(`student/${uid}`)
                // Only include existing values that are not false
                // https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data#orderbychild
                .startAt(true)
            }
            itemsToFetchRef.once('value', snapshot => {
              const resources = snapshot.val()
              if (!resources) return resolve([])
              const resourceKeys = Object.keys(resources)
              resolve(resourceKeys)
            })
          }).then(keysToSync => {
            const accessibleFieldGroupNames = smallFieldGroupNames
              .filter(fieldGroupName => {
                return (
                  // Instructors can access all field groups
                  roles.instructor ||
                  // Students can access public, authed, and student fields
                  ['public', 'authed', 'student'].includes(fieldGroupName)
                )
              })
            return Promise.all(flatten([
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
      ...mapAndMerge(resourceNames, resourceName => {
        return {
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
      })
    }
  }
}
