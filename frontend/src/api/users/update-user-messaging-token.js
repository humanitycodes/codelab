import axios from 'axios'

export default async ({ userId, messagingToken }) => {
  return axios.put(
    `/api/users/${userId}/messagingToken`,
    { messagingToken }
  )
  .then(response => response.data)
  .catch(error => {
    console.log(
      `Error updating messaging token on user ${userId}.`,
      'Reason:', error
    )
    throw error
  })
}
