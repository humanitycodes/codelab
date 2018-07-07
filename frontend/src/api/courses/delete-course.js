import axios from 'axios'

export default async courseId =>
  axios.delete(`/api/courses/${courseId}`)
  .catch(error => {
    console.log(
      `Error deleting course ${courseId}.`,
      'Reason:', error
    )
    throw error
  })
