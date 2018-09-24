import firebaseAdmin from 'firebase-admin'
import firebaseAdminPrivateKeyJson from '../../env/firebase-admin-private-key-json'
import firebaseProjectId from '../../env/firebase-project-id'

const firebaseCredential = JSON.parse(firebaseAdminPrivateKeyJson)
const privateKey = firebaseCredential.private_key
firebaseCredential.private_key = privateKey.replace(/\\n/g, '\n')
console.error('Firebase Credential:', firebaseCredential)

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseCredential),
  projectId: firebaseProjectId
})

export default firebaseAdmin.messaging()
