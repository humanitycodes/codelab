<script>
import env from '@env'
import AuthLink from '@components/auth-link'

export default {
  extends: AuthLink,
  data () {
    return {
      url: 'https://oauth.ais.msu.edu/oauth/authorize?response_type=code&client_id=' + env.msuAuthClientId
    }
  }
}
</script>
