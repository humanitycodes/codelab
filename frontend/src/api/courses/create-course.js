import axios from 'axios'

export default async course => {
  return axios.post('/api/courses', course)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error creating course ${course}.`,
        'Reason:', error
      )
      throw error
    })
}
