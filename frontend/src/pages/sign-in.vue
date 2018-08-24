<script>
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    store.dispatch('signIn', { token: decodeURIComponent(to.query.token) })
      .then(() => next(to.query.returnPath || '/'))
  },
  render () {
    return ''
  }
}
</script>
