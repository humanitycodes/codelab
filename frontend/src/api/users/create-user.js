import axios from 'axios'

export default async user => {
  return axios.post('/api/users', user)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error creating user ${user}.`,
        'Reason:', error
      )
      throw error
    })
}
