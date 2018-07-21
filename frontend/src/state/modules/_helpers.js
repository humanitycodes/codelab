import axios from 'axios'
import store from '@state/store'

// Save JWT to local storage and configure Axios to authenticate with it
export const setAuthToken = token => {
  if (token) {
    localStorage.setItem('auth_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('auth_token')
    axios.defaults.headers.common['Authorization'] = null
  }
}

// If the server issues a new JWT via the 'x-token-refresh' header,
// save and re-configure the app to use the new token
export const refreshTokenFromResponse = result => {
  // The result may be a response or an error with a response property
  const response = result.response || result
  if (
    response &&
    response.headers &&
    response.headers.hasOwnProperty('x-token-refresh')
  ) {
    setAuthToken(response.headers['x-token-refresh'])
    return store.dispatch('attemptAutoSignIn').then(() => response)
  }
  return response
}
