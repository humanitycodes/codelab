import axios from 'axios'

export default async lessonId => {
  return axios.get(`/api/lessons/${lessonId}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error getting lesson ${lessonId}:`, error)
      throw error
    })
}
