import firebaseAdmin from 'firebase-admin'
import firebaseAdminPrivateKeyJson from '../../env/firebase-admin-private-key-json'
import firebaseProjectId from '../../env/firebase-project-id'

// Some managed hosting environments like Heroku escape newlines in
// environment variables, so explicitly unescape them
const firebaseCredential = JSON.parse(firebaseAdminPrivateKeyJson)
const privateKey = firebaseCredential.private_key
firebaseCredential.private_key = privateKey.replace(/\\n/g, '\n')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseCredential),
  projectId: firebaseProjectId
})

export default firebaseAdmin.messaging()
