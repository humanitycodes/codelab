<script>
import firebase from 'firebase'
import jwtDecode from 'jwt-decode'

export default {
  beforeRouteEnter (to, from, next) {
    let token = decodeURIComponent(to.query.token)
    let decodedToken = jwtDecode(token)

    firebase.auth().signInWithCustomToken(token)
    .then(() => {
      const msuInfo = decodedToken.claims.msu
      return Promise.all([
        firebase.auth().currentUser.updateEmail(msuInfo.email),
        firebase.auth().currentUser.updateProfile({ displayName: msuInfo.name })
      ])
    })
    .then(() => {
      localStorage.setItem('token', token)
      next('/')
    })
    .catch(console.error)
  }
}
</script>
