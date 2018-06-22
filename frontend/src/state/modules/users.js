import isEqual from 'lodash/isEqual'
import jwtDecode from 'jwt-decode'
import requiredGitHubScopes from '@constants/github-scopes'
import Axios from 'axios'

export default {
  state: {
    currentUser: null,
    userRoles: null,
    all: []
  },
  getters: {
    isUserSignedIn (state) {
      return !!state.currentUser
    },
    hasNewGitHubScopes (state) {
      if (!state.currentUser) return false

      if (state.currentUser.githubScope) {
        const userScopes = state.currentUser.githubScope.split(',')
        return !isEqual(requiredGitHubScopes.sort(), userScopes.sort())
      }
      return true
    },
    jsonWebToken (state) {
      return state.currentUser
        ? localStorage.getItem('auth_token')
        : null
    }
  },
  actions: {
    attemptAutoSignIn ({ dispatch }) {
      const token = localStorage.getItem('auth_token')
      return token
        ? dispatch('signIn', { token })
        : dispatch('signOut')
    },
    signIn ({ commit }, { token }) {
      localStorage.setItem('auth_token', token)
      Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const user = jwtDecode(token).user
      commit('SET_CURRENT_USER', user)

      return Promise.resolve(user)
    },
    signOut ({ commit }) {
      localStorage.removeItem('auth_token')
      Axios.defaults.headers.common['Authorization'] = null
      commit('SET_CURRENT_USER', null)
      return Promise.resolve()
    },
    updateCurrentUser ({ state }) {
      // DB TODO: Call /api/users/me to update user fields
      return Promise.resolve(state)
    }
  },
  mutations: {
    SET_CURRENT_USER (state, newUser) {
      state.currentUser = newUser
    }
  }
}
