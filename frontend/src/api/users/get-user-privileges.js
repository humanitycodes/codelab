import axios from 'axios'

export default async ({ userId }) => {
  return axios.get(`/api/users/${userId}/privileges`)
    .then(response => response.data)
    .catch(error => {
      console.error(
        `Error getting privileges for user ${userId}:`, error
      )
      throw error
    })
}
