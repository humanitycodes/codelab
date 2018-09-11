import axios from 'axios'

export default async ({ userId, messagingToken }) => {
  return axios.post(
    `/api/users/${userId}/messaging-tokens`,
    { messagingToken }
  )
  .then(response => response.data)
  .catch(error => {
    console.log(
      `Error creating messaging token for user ${userId}.`,
      'Reason:', error
    )
    throw error
  })
}
