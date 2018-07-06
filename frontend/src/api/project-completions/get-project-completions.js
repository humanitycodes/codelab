import axios from 'axios'

export default async () => {
  return axios.get('/api/project-completions')
    .then(response => response.data)
    .catch(error => {
      console.error('Error getting all project completions:', error)
      throw error
    })
}
