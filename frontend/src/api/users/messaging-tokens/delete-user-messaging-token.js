import axios from 'axios'

export default async ({ userId, userMessagingTokenId }) =>
  axios.delete(
    `/api/users/${userId}/messaging-tokens/${userMessagingTokenId}`
  )
  .catch(error => {
    console.log(
      `Error deleting messaging token ${userMessagingTokenId}`,
      `for user ${userId}.`,
      'Reason:', error
    )
    throw error
  })
