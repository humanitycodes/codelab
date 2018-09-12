import axios from 'axios'
import isEqual from 'lodash/isEqual'
import jwtDecode from 'jwt-decode'
import requiredGitHubScopes from '@constants/github-scopes'
import setAuthToken from './_helpers/set-auth-token'
import refreshTokenFromResponse from './_helpers/refresh-token-from-response'
import getUsers from '@api/users/get-users'
import initMessaging from '@notifications/init-messaging'
import createUserMessagingToken from '@api/users/messaging-tokens/create-user-messaging-token'
import deleteUserMessagingToken from '@api/users/messaging-tokens/delete-user-messaging-token'

const syncCache = {}

/* eslint-env browser */
export default {
  state: {
    currentUser: null,
    all: [],
    userMessagingToken: null
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
      return !state.userMessagingToken
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
    },
    userMessagingToken (state) {
      return state.userMessagingToken
    }
  },
  actions: {
    assignMessagingToken ({ state, commit }, { messagingToken }) {
      const currentUserMessagingToken = state.userMessagingToken

      // Do nothing if the token has not changed
      if (
        ( // Current and new tokens are both null
          !currentUserMessagingToken &&
          !messagingToken
        ) ||
        ( // Current and new tokens are equal
          currentUserMessagingToken &&
          currentUserMessagingToken.messagingToken === messagingToken
        )
      ) {
        return
      }

      const userId = state.currentUser.userId
      if (messagingToken) {
        // Create the new messaging token
        createUserMessagingToken({ userId, messagingToken })
        .then(userMessagingToken => {
          // Delete the old messaging token if it exists
          if (currentUserMessagingToken) {
            const { userMessagingTokenId } = currentUserMessagingToken
            return deleteUserMessagingToken({ userId, userMessagingTokenId })
              .then(() => userMessagingToken)
          } else {
            return userMessagingToken
          }
        })
        .then(userMessagingToken => {
          // Save the new messaging token
          commit('SET_USER_MESSAGING_TOKEN', userMessagingToken)
        })
      } else {
        // Delete the old messaging token
        const { userMessagingTokenId } = currentUserMessagingToken
        return deleteUserMessagingToken({ userId, userMessagingTokenId })
          .then(() => {
            // Clear the stored messaging token
            commit('SET_USER_MESSAGING_TOKEN', null)
          })
      }
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

      // Restore messaging token
      commit('RESTORE_USER_MESSAGING_TOKEN')

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
    RESTORE_USER_MESSAGING_TOKEN (state) {
      const userMessagingToken = JSON.parse(
        localStorage.getItem('user_messaging_token')
      )
      state.userMessagingToken = userMessagingToken
    },
    SET_USER_MESSAGING_TOKEN (state, userMessagingToken) {
      if (userMessagingToken) {
        localStorage.setItem(
          'user_messaging_token',
          JSON.stringify(userMessagingToken)
        )
      } else {
        localStorage.removeItem('user_messaging_token')
      }
      state.userMessagingToken = userMessagingToken
    }
  }
}
