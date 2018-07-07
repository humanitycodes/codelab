import axios from 'axios'

export default async projectCompletionId =>
  axios.delete(`/api/project-completions/${projectCompletionId}`)
  .catch(error => {
    console.log(
      `Error deleting project completion ${projectCompletionId}.`,
      'Reason:', error
    )
    throw error
  })
