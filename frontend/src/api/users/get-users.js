import axios from 'axios'

export default async () => {
  return axios.get('/api/users')
    .then(response => response.data)
    .catch(error => {
      console.error('Error getting all users:', error)
      throw error
    })
}
