import axios from 'axios'
import isEqual from 'lodash/isEqual'
import jwtDecode from 'jwt-decode'
import requiredGitHubScopes from '@constants/github-scopes'
import { setAuthToken, refreshTokenFromResponse } from './_helpers'

const syncCache = {}

export default {
  state: {
    currentUser: null,
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
    signIn ({ commit, state }, { token }) {
      setAuthToken(token)

      const user = jwtDecode(token).user
      commit('SET_CURRENT_USER', user)

      if (!syncCache.refreshTokenInterceptor) {
        syncCache.refreshTokenInterceptor = axios.interceptors.response.use(
          refreshTokenFromResponse
        )
      }

      return user
    },
    signOut ({ commit, state }) {
      setAuthToken(null)
      commit('SET_CURRENT_USER', null)

      if (syncCache.refreshTokenInterceptor) {
        axios.interceptors.request.eject(syncCache.refreshTokenInterceptor)
        delete syncCache.refreshTokenInterceptor
      }

      return Promise.resolve()
    },
    updateCurrentUser ({ state }) {
      // DB TODO: Call /api/users/me to update user fields
      return Promise.resolve(state)
    }
  },
  mutations: {
    SET_CURRENT_USER (state, user) {
      state.currentUser = user
    }
  }
}
