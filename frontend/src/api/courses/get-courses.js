import axios from 'axios'

export default async () => {
  return axios.get('/api/courses')
    .then(response => response.data)
    .catch(error => {
      console.log('Error getting all courses:', error)
      throw error
    })
}
