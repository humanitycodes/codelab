import axios from 'axios'

export default async courseId => {
  return axios.get(`/api/courses/${courseId}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error getting course ${courseId}:`, error)
      throw error
    })
}
