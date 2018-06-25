<script>
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    // Use a callback to complete the navigation before signing out so that
    // the previous components unload. Signing out before navigating clears
    // the application state before navigation completes triggers re-rendering
    // components on the previous route, which is unwanted and error-prone.
    next(() => store.dispatch('signOut').then(() => next('/')))
  },
  render () {}
}
</script>
