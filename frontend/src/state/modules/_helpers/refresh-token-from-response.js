import store from '@state/store'
import setAuthToken from './set-auth-token'

// If the server issues a new JWT via the 'x-token-refresh' header,
// save and re-configure the app to use the new token
export default result => {
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
