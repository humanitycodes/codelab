<script>
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    store.dispatch('signIn', decodeURIComponent(to.query.token))
      .then(() => { window.location.replace('/') })
  }
}
</script>
