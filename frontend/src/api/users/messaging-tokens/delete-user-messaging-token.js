import axios from 'axios'

export default async ({ userId, userMessagingTokenId }) =>
  axios.delete(
    `/api/users/${userId}/messaging-tokens/${userMessagingTokenId}`
  )
  .catch(error => {
    // It's okay if the delete failed because it was already gone
    if (error.response && error.response.status === 404) return

    console.log(
      `Error deleting messaging token ${userMessagingTokenId}`,
      `for user ${userId}.`,
      'Reason:', error
    )
    throw error
  })
