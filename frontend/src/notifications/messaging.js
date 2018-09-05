import firebase from 'firebase/app'
import 'firebase/messaging'
import firebaseClientConfig from '@env/firebase-client-config'
import firebaseVapidPublicKey from '@env/firebase-vapid-public-key'

firebase.initializeApp(firebaseClientConfig)

const messaging = firebase.messaging()
messaging.usePublicVapidKey(firebaseVapidPublicKey)

export default messaging
