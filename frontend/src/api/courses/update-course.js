import axios from 'axios'

export default async course => {
  return axios.put(`/api/courses/${course.courseId}`, course)
    .then(response => {
      // Reject 404 Not Found responses so callers can handle them as exceptions
      if (response.status === 404) {
        const error = new Error(`Course ${course.courseId} does not exist.`)
        error.response = response
        return Promise.reject(error)
      }
      return response.data
    })
    .catch(error => {
      console.log(
        `Error updating course ${course.courseId}.`,
        'Reason:', error
      )
      throw error
    })
}
