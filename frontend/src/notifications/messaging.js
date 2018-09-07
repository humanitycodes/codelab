import firebase from 'firebase/app'
import 'firebase/messaging'
import firebaseClientConfig from '@env/firebase-client-config'

firebase.initializeApp(firebaseClientConfig)

export default firebase.messaging()
