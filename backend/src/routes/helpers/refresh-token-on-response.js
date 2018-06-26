// If the client has been successfully authenticated and the token has been
// refreshed on the request, copy the token to the response so the client will
// receive the new JWT to use for future requests.
export default {
  type: 'onPreResponse',
  method (request, h) {
    if (
      request.response &&
      request.headers.hasOwnProperty('x-token-refresh')
    ) {
      request.response.headers['x-token-refresh'] = request.headers['x-token-refresh']
    }
    return h.continue
  }
}
