import axios from 'axios'
import isEqual from 'lodash/isEqual'
import jwtDecode from 'jwt-decode'
import requiredGitHubScopes from '@constants/github-scopes'
import { setAuthToken, refreshTokenFromResponse } from './_helpers'
import { userRolesHaveChanged } from '@state/auth/users'

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
    signIn ({ commit, dispatch, state }, { token }) {
      setAuthToken(token)

      const user = jwtDecode(token).user
      const hasAuthStatusChanged = userRolesHaveChanged(state.currentUser, user)
      commit('SET_CURRENT_USER', user)

      // Look in response headers for updated user/auth information
      if (!syncCache.refreshTokenInterceptor) {
        syncCache.refreshTokenInterceptor = axios.interceptors.response.use(
          refreshTokenFromResponse
        )
      }

      // Sync data if roles or signin status just changed
      if (hasAuthStatusChanged) {
        return Promise.all([
          dispatch('syncAllCourses')
        ]).then(() => user)
      }
      return user
    },
    signOut ({ commit }) {
      setAuthToken(null)
      commit('SET_CURRENT_USER', null)

      if (syncCache.refreshTokenInterceptor) {
        axios.interceptors.request.eject(syncCache.refreshTokenInterceptor)
        delete syncCache.refreshTokenInterceptor
      }
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
