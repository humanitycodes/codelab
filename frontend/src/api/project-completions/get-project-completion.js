import axios from 'axios'

export default async projectCompletionId => {
  return axios.get(`/api/project-completions/${projectCompletionId}`)
    .then(response => {
      // Reject 404 Not Found responses so callers can handle them as exceptions
      if (response.status === 404) {
        const error = new Error(
          `Project completion ${projectCompletionId} does not exist.`
        )
        error.response = response
        return Promise.reject(error)
      }
      return response.data
    })
    .catch(error => {
      console.error(
        `Error getting project completion ${projectCompletionId}:`,
        error
      )
      throw error
    })
}
