import axios from 'axios'

export default async () => {
  return axios.get('/api/courses')
    .then(response => response.data)
    .catch(error => {
      console.log('Error fetching all courses:', error)
      return error
    })
}
