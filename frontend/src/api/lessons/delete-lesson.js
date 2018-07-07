import axios from 'axios'

export default async lessonId =>
  axios.delete(`/api/lessons/${lessonId}`)
  .catch(error => {
    console.log(
      `Error deleting lesson ${lessonId}.`,
      'Reason:', error
    )
    throw error
  })
