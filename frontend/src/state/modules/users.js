import firebase from 'firebase'
import jwtDecode from 'jwt-decode'

export default {
  state: {
    currentUser: null,
    userRoles: null
  },
  getters: {
    userSignedIn (state) {
      return !!state.currentUser
    },
    userIsStudent (state) {
      return !!state.currentUser && !!state.userRoles && state.userRoles.student
    },
    userIsInstructor (state) {
      return !!state.currentUser && !!state.userRoles && state.userRoles.instructor
    },
    userIsAdmin (state) {
      return !!state.currentUser && !!state.userRoles && state.userRoles.admin
    }
  },
  actions: {
    syncCurrentUser ({ commit }) {
      firebase.auth().onAuthStateChanged(user => {
        commit('SET_CURRENT_USER', user)

        if (user) {
          firebase.database().ref(`roles/${user.uid}`)
          .on('value', roleSnapshot => {
            commit('SET_CURRENT_ROLES', roleSnapshot.val())
          })
        } else {
          commit('SET_CURRENT_ROLES', null)
        }
      })
    },
    signIn ({ commit }, token) {
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
    signOut ({ commit }) {
      return firebase.auth().signOut()
    }
  },
  mutations: {
    SET_CURRENT_USER (state, newUser) {
      state.currentUser = newUser
    },
    SET_CURRENT_ROLES (state, newRoles) {
      state.userRoles = newRoles
    }
  }
}
