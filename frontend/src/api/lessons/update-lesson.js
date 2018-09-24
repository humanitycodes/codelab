import axios from 'axios'

export default async lesson => {
  return axios.put(`/api/lessons/${lesson.lessonId}`, lesson)
    .then(response => {
      // Reject 404 Not Found responses so callers can handle them as exceptions
      if (response.status === 404) {
        const error = new Error(`Lesson ${lesson.lessonId} does not exist.`)
        error.response = response
        return Promise.reject(error)
      }
      return response.data
    })
    .catch(error => {
      console.log(
        `Error updating lesson ${lesson.lessonId}.`,
        'Reason:', error
      )
      throw error
    })
}
