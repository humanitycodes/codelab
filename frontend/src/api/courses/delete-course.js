import axios from 'axios'

export default async courseId => {
  return axios.delete(`/api/courses/${courseId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error deleting course ${courseId}.`,
        'Reason:', error
      )
      throw error
    })
}
