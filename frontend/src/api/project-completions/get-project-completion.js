import axios from 'axios'

export default async projectCompletionId => {
  return axios.get(`/api/project-completions/${projectCompletionId}`)
    .then(response => response.data)
    .catch(error => {
      console.error(
        `Error getting project completion ${projectCompletionId}:`,
        error
      )
      throw error
    })
}
