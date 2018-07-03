import firebase from 'firebase/app'
import env from '@env'

export default firebase.initializeApp(env.firebaseConfig)
