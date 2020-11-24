import axios from 'axios'

// Save JWT to local storage and configure Axios to authenticate with it
export default token => {
  if (token) {
    localStorage.setItem('auth_token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('auth_token')
    axios.defaults.headers.common.Authorization = null
  }
}
