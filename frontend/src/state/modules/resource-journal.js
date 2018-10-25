import { keys, get, del, set } from 'idb-keyval'

const syncActionName = {
  'course': 'syncCourse',
  'lesson': 'syncLesson',
  'project-completion': 'syncProjectCompletion'
}

export default {
  state: {
    lastSyncTimestamp: 0
  },
  actions: {
    syncResourceJournal ({ commit, dispatch, state }) {
      // Get the current time so any new resources marked as dirty in the
      // journal will get sync'd next time this action is dispatched
      const syncTimestamp = Date.now()

      keys()
      .then(resourceIds => {
        return Promise.all(
          resourceIds.map(resourceId => {
            return get(resourceId).then(journal => {
              // Look for journal entries that were changed since the last sync
              const { resourceType, timestamp } = journal
              if (timestamp <= state.lastSyncTimestamp) return
              return dispatch('syncResource', {
                resourceType, resourceId, syncTimestamp
              })
            })
          })
        )
      })
      .then(() => {
        // Save the sync timestamp in case the page needs to resync
        commit('SET_LAST_SYNC_TIMESTAMP', syncTimestamp)
      })
    },
    syncResource ({ dispatch }, { resourceType, resourceId, syncTimestamp }) {
      const action = syncActionName[resourceType]
      if (!action) return
      return dispatch(action, resourceId)
        .then(resource => {
          if (resource) {
            // Set the timestamp to avoid re-fetching when there aren't changes
            const timestamp = syncTimestamp || Date.now()
            return set(resourceId.toString(), { resourceType, timestamp })
          } else {
            // If the action resolved null, remove the resource from the journal
            return del(resourceId)
          }
        })
    }
  },
  mutations: {
    SET_LAST_SYNC_TIMESTAMP (state, timestamp) {
      state.lastSyncTimestamp = timestamp
    }
  }
}
