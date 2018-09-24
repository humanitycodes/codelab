import axios from 'axios'

export default async lessonId =>
  axios.delete(`/api/lessons/${lessonId}`)
  .catch(error => {
    // It's okay if the delete failed because it was already gone
    if (error.response && error.response.status === 404) return

    console.log(
      `Error deleting lesson ${lessonId}.`,
      'Reason:', error
    )
    throw error
  })
