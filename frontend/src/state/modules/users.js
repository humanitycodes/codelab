import firebase from 'firebase'
import db from '@plugins/firebase'
import jwtDecode from 'jwt-decode'
import { createFirebaseVM } from './_helpers'

export default {
  state: {
    currentUser: null,
    userRoles: null,
    all: []
  },
  getters: {
    userSignedIn (state) {
      return !!state.currentUser
    }
  },
  actions: {
    syncCurrentUser ({ commit, state, rootState }) {
      return firebase.auth().getToken()
        .then(firebaseTokenResult => {
          return new Promise((resolve, reject) => {
            let userRef, rolesRef
            const currentUserCallback = userSnapshot => {
              let user = userSnapshot.val()
              commit('SET_CURRENT_USER', {
                ...user,
                uid: userSnapshot.key,
                firebaseJwt: firebaseTokenResult.accessToken || firebaseTokenResult.refreshToken
              })
              resolve(rootState)
            }
            const currentRolesCallback = roleSnapshot => {
              commit('SET_CURRENT_ROLES', roleSnapshot.val())
              resolve(rootState)
            }

            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                userRef = db.ref('users').child(user.uid)
                userRef.on('value', currentUserCallback)

                rolesRef = db.ref(`roles/${user.uid}`)
                rolesRef.on('value', currentRolesCallback)
              } else {
                commit('SET_CURRENT_USER', null)
                commit('SET_CURRENT_ROLES', null)

                if (userRef) {
                  userRef.off('value', currentUserCallback)
                  userRef = null
                }
                if (rolesRef) {
                  rolesRef.off('value', currentRolesCallback)
                  rolesRef = null
                }
                resolve(rootState)
              }
            })
          })
        })
    },
    syncUsers ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        createFirebaseVM({
          users: db.ref('users')
        })
        .then(vm => {
          commit('SET_USERS', vm.users)
          resolve(rootState)
          vm.$watch('users', (newUsers, oldUsers) => {
            commit('SET_USERS', newUsers)
          })
        })
        .catch(resolve)
      })
    },
    signIn (_, token) {
      return firebase.auth().signInWithCustomToken(token)
        .then(() => {
          const profile = jwtDecode(token).claims.profile
          return Promise.all([
            firebase.auth().currentUser.updateEmail(profile.email),
            firebase.auth().currentUser.updateProfile({ displayName: profile.fullName })
          ])
        })
        .catch(console.error)
    },
    signOut () {
      return firebase.auth().signOut()
    }
  },
  mutations: {
    SET_CURRENT_USER (state, newUser) {
      state.currentUser = newUser
    },
    SET_CURRENT_ROLES (state, newRoles) {
      state.userRoles = newRoles
    },
    SET_USERS (state, newUsers) {
      state.all = newUsers
    }
  }
}
