import axios from 'axios'

export default async lessonId => {
  return axios.delete(`/api/lessons/${lessonId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error deleting lesson ${lessonId}.`,
        'Reason:', error
      )
      throw error
    })
}
