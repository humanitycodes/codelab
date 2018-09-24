import axios from 'axios'

export default async ({ projectCompletionId, instructorUserId }) => {
  return axios.put(
    `/api/project-completions/${projectCompletionId}/instructorUserId`,
    { instructorUserId }
  )
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
    console.log(
      `Error updating instructor on project completion ${projectCompletionId}.`,
      'Reason:', error
    )
    throw error
  })
}
