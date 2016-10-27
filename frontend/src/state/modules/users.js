import firebase from 'firebase'
import jwtDecode from 'jwt-decode'

export default {
  state: {
    currentUser: null
  },
  getters: {
    userSignedIn (state) {
      return !!state.currentUser
    }
  },
  actions: {
    syncCurrentUser ({ commit }) {
      firebase.auth().onAuthStateChanged(user => {
        commit('SET_CURRENT_USER', user)
      })
    },
    signIn ({ commit }, token) {
      const decodedToken = jwtDecode(token)
      return firebase.auth().signInWithCustomToken(token)
        .then(() => {
          const msuInfo = decodedToken.claims.msu
          return Promise.all([
            firebase.auth().currentUser.updateEmail(msuInfo.email),
            firebase.auth().currentUser.updateProfile({ displayName: msuInfo.name })
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
    }
  }
}
