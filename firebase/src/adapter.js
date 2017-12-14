import Vue from 'vue'
import flatten from 'lodash/flatten'
import mapAndMerge from './utils/map-and-merge'
import singularize from './utils/singularize'
import capitalize from './utils/capitalize'
import defineKey from './surface-api/key'
import defineMeta from './surface-api/meta'
import defineRelationships from './surface-api/relationships'
import defineFields from './surface-api/fields'
import defineAddRecord from './surface-api/record-add'
import defineRemoveRecord from './surface-api/record-remove'
import resourceDefs from './defs/resources'

const resourceNames = Object.keys(resourceDefs)

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
            // For each of the keys that we want to fetch information for
            for (const resourceKey in stateDefs) {
              const resourceItem = {}
              const context = {
                // Object to be patched
                resourceItem,
                // Resource
                resourceName, resourceKey, resourceDefs,
                // Vuex state
                state, stateDefs,
                // User
                uid, roles,
                // Firebase DB
                db
              }
              defineKey(context)
              defineMeta(context)
              defineRelationships(context)
              defineFields(context)
              // The item/record is done being built, add it to the resourceArray
              resourceArray.push(resourceItem)
            }
            defineAddRecord({
              resourceArray,
              resourceName,
              uid,
              db
            })
            defineRemoveRecord({
              resourceArray,
              resourceName, resourceDefs,
              db
            })
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
      syncResources ({ rootState, commit }, { ignoreCache } = {}) {
        // Skip syncing if we've already synced once
        if (alreadySyncedCache.allResources && !ignoreCache) return Promise.resolve()
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
