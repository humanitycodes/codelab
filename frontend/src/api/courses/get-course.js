import axios from 'axios'

export default async courseId => {
  return axios.get(`/api/courses/${courseId}`)
    .then(response => {
      // Reject 404 Not Found responses so callers can handle them as exceptions
      if (response.status === 404) {
        const error = new Error(`Course ${courseId} does not exist.`)
        error.response = response
        return Promise.reject(error)
      }
      return response.data
    })
    .catch(error => {
      console.error(`Error getting course ${courseId}:`, error)
      throw error
    })
}
