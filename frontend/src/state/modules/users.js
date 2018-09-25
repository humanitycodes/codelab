import axios from 'axios'
import isEqual from 'lodash/isEqual'
import jwtDecode from 'jwt-decode'
import requiredGitHubScopes from '@constants/github-scopes'
import setAuthToken from './_helpers/set-auth-token'
import refreshTokenFromResponse from './_helpers/refresh-token-from-response'
import getUsers from '@api/users/get-users'
import initMessaging from '@notifications/init-messaging'
import createUserMessagingToken from '@api/users/messaging-tokens/create-user-messaging-token'
import messagingAllowedByUser from '@notifications/messaging-allowed-by-user'
import messagingSupportedByBrowser from '@notifications/messaging-supported-by-browser'

const syncCache = {}

/* eslint-env browser */
export default {
  state: {
    currentUser: null,
    all: [],
    isMessagingAllowedByUser: messagingAllowedByUser()
  },
  getters: {
    users (state) {
      return state.all
    },
    currentUser (state) {
      return state.currentUser
    },
    isUserSignedIn (state) {
      return !!state.currentUser
    },
    isUserSetupRequired (state) {
      return !state.isMessagingAllowedByUser
    },
    isMessagingAllowedByUser (state) {
      return state.isMessagingAllowedByUser
    },
    isMessagingSupportedByBrowser () {
      return messagingSupportedByBrowser()
    },
    hasNewGitHubScopes (state, getters) {
      if (!getters.isUserSignedIn) return false

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
    assignMessagingToken ({ state, commit }, { messagingToken }) {
      if (!messagingToken) return

      // Create the new messaging token
      const userId = state.currentUser.userId
      return createUserMessagingToken({ userId, messagingToken })
        .then(() => commit('REFRESH_MESSAGING_ALLOWED_BY_USER'))
    },
    attemptAutoSignIn ({ dispatch }) {
      const token = localStorage.getItem('auth_token')
      return token
        ? dispatch('signIn', { token })
        : dispatch('signOut')
    },
    signIn ({ commit, dispatch }, { token }) {
      setAuthToken(token)

      const user = jwtDecode(token).user
      commit('SET_CURRENT_USER', user)

      // Look in response headers for updated user/auth information
      if (!syncCache.refreshTokenInterceptor) {
        syncCache.refreshTokenInterceptor = axios.interceptors.response.use(
          refreshTokenFromResponse, refreshTokenFromResponse
        )
      }

      // Sync any data the user may have access to
      return Promise.all([
        initMessaging(),
        dispatch('syncAllCourses'),
        dispatch('syncAllLessons'),
        dispatch('syncAllUsers'),
        dispatch('syncAllProjectCompletions')
      ]).then(() => user)
    },
    signOut ({ commit }) {
      setAuthToken(null)
      commit('SET_CURRENT_USER', null)

      if (syncCache.refreshTokenInterceptor) {
        axios.interceptors.request.eject(syncCache.refreshTokenInterceptor)
        delete syncCache.refreshTokenInterceptor
      }
    },
    syncAllUsers ({ commit }) {
      return getUsers()
        .then(users => commit('SET_ALL_USERS', users))
        .catch(error => {
          commit('SET_ALL_USERS', [])
          throw error
        })
    }
  },
  mutations: {
    SET_ALL_USERS (state, users) {
      state.all = users
    },
    SET_CURRENT_USER (state, user) {
      state.currentUser = user
    },
    REFRESH_MESSAGING_ALLOWED_BY_USER (state) {
      state.isMessagingAllowedByUser = messagingAllowedByUser()
    }
  }
}
