import firebaseAdmin from 'firebase-admin'
import firebaseAdminPrivateKeyJson from '../../env/firebase-admin-private-key-json'
import firebaseProjectId from '../../env/firebase-project-id'

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    JSON.parse(firebaseAdminPrivateKeyJson)
  ),
  projectId: firebaseProjectId
})

export default firebaseAdmin.messaging()
