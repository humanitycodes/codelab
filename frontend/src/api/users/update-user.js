import axios from 'axios'

export default async partialUser => {
  return axios.put(`/api/users/${partialUser.userId}`, partialUser)
    .then(response => {
      // Reject error responses so callers can handle them as exceptions
      if (response.status !== 200) {
        const error = new Error(`Unable to update user ${partialUser.userId}.`)
        error.response = response
        return Promise.reject(error)
      }
      return response.data
    })
    .catch(error => {
      console.log(
        `Error updating user ${partialUser.userId}.`,
        'Reason:', error
      )
      throw error
    })
}
