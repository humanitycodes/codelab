import axios from 'axios'

export default async ({ projectCompletionId, instructorUserId }) => {
  return axios.put(
    `/api/project-completions/${projectCompletionId}/instructorUserId`,
    { instructorUserId }
  )
  .then(response => response.data)
  .catch(error => {
    console.log(
      `Error updating instructor on project completion ${projectCompletionId}.`,
      'Reason:', error
    )
    throw error
  })
}
