import axios from 'axios'

export default async lessonId => {
  return axios.get(`/api/lessons/${lessonId}`)
    .then(response => {
      // Reject 404 Not Found responses so callers can handle them as exceptions
      if (response.status === 404) {
        const error = new Error(`Lesson ${lessonId} does not exist.`)
        error.response = response
        return Promise.reject(error)
      }
      return response.data
    })
    .catch(error => {
      console.error(`Error getting lesson ${lessonId}:`, error)
      throw error
    })
}
