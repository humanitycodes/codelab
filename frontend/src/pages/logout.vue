<script>
import firebase from 'firebase'

export default {
  beforeRouteEnter (to, from, next) {
    firebase.auth().signOut()
    .then(() => {
      localStorage.removeItem('token')
      next('/')
    })
  }
}
</script>
