import firebaseAdmin from 'firebase-admin'
import firebaseAdminPrivateKeyJson from '../../env/firebase-admin-private-key-json'
import firebaseProjectId from '../../env/firebase-project-id'

const firebaseAdminPrivateKey = JSON.parse(firebaseAdminPrivateKeyJson)
console.error('Firebase Credential:', firebaseAdminPrivateKey)

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseAdminPrivateKey),
  projectId: firebaseProjectId
})

export default firebaseAdmin.messaging()
