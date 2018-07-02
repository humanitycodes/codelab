import axios from 'axios'

export default async lesson => {
  return axios.put(`/api/lessons/${lesson.lessonId}`, lesson)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error deleting lesson ${lesson.lessonId}.`,
        'Reason:', error
      )
      throw error
    })
}
