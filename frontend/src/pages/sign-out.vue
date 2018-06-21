<script>
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    store.dispatch('signOut').then(() => next('/'))
  }
}
</script>
