import axios from 'axios'

export default async () => {
  return axios.get('/api/lessons')
    .then(response => response.data)
    .catch(error => {
      console.error('Error getting all lessons:', error)
      throw error
    })
}
