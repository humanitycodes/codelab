import boom from 'boom'

export default {
  method: 'GET',
  path: '/courses',
  handler: function* (request, h) {
    try {
      console.error('Helllooooo')
      return []
    } catch (error) {
      console.error(`Unable to get courses for user. Reason:`, error)
      return boom.wrap(error)
    }
  }
}
