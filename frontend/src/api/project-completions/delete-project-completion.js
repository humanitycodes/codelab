import axios from 'axios'

export default async projectCompletionId =>
  axios.delete(`/api/project-completions/${projectCompletionId}`)
  .catch(error => {
    // It's okay if the delete failed because it was already gone
    if (error.response && error.response.status === 404) return

    console.log(
      `Error deleting project completion ${projectCompletionId}.`,
      'Reason:', error
    )
    throw error
  })
