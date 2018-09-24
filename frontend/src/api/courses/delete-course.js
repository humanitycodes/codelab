import axios from 'axios'

export default async courseId =>
  axios.delete(`/api/courses/${courseId}`)
  .catch(error => {
    // It's okay if the delete failed because it was already gone
    if (error.response && error.response.status === 404) return

    console.log(
      `Error deleting course ${courseId}.`,
      'Reason:', error
    )
    throw error
  })
