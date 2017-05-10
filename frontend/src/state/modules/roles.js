import store from '@state/store'
import db from '@plugins/firebase'
import firebase from 'firebase'
import { createFirebaseVM } from './_helpers'

const syncCache = {}
export default {
  state: {
    all: []
  },
  actions: {
    syncRoles ({ commit, rootState }) {
      if (syncCache.roles) return Promise.resolve(rootState)
      syncCache.roles = true
      return new Promise((resolve, reject) => {
        createFirebaseVM({
          roles: db.ref('roles')
        })
        .then(vm => {
          commit('SET_ROLES', vm.roles)
          resolve(rootState)
          vm.$watch('roles', (newRoles, oldRoles) => {
            commit('SET_ROLES', newRoles)
          })
        })
        .catch(resolve)
      })
    },
    updateUserRole (_, { userKey, roleName, enabled }) {
      return firebase.database().ref('roles')
        .child(userKey)
        .child(roleName)
        .set(enabled)
        .then(() => {
          store.dispatch('syncRoles')
        })
    }
  },
  mutations: {
    SET_ROLES (state, newRoles) {
      state.all = newRoles
    }
  }
}
