import axios from 'axios'
import retry from 'retry-as-promised'
import firebaseMessagingServerKey from '../../env/firebase-messaging-server-key'

const maxAttempts = 9

export default async (message) => {
  const params = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${firebaseMessagingServerKey}`
    },
    url: 'https://fcm.googleapis.com/fcm/send',
    data: message
  }

  console.log('sending message:', message)

  // With maxAttempts = 9, backoffBase = 100, backoffExp = 1.1
  // the max duration of a request including all retries is 34,253 ms
  return retry(() => axios(params), maxAttempts)
    .then(response => response.data)
    .catch(error => {
      throw new Error('Unable to send message. Reason:', error)
    })
}
