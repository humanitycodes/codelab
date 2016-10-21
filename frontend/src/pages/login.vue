<script>
import firebase from 'firebase'

export default {
  beforeRouteEnter (to, from, next) {
    let token = decodeURIComponent(to.query.token)
    localStorage.setItem('token', token)
    firebase.auth().signInWithCustomToken(token)
    .then(function (result) {
      console.log(result)
    })
    .catch(function (error) {
      console.log(error)
    })
    next('/')
  }
}
</script>
