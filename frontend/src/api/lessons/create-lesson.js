import axios from 'axios'

export default async lesson => {
  return axios.post('/api/lessons', lesson)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error creating lesson ${lesson}.`,
        'Reason:', error
      )
      throw error
    })
}
