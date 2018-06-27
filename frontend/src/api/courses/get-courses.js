import axios from 'axios'

export default async () => {
  return axios.get('/api/courses')
    .then(response => response.data)
    .catch(error => {
      console.error('Error getting all courses:', error)
      throw error
    })
}
