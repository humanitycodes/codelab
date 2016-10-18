<script>
import env from '@env'
import AuthLink from '@components/auth-link'

export default {
  extends: AuthLink,
  data () {
    return {
      url: 'https://github.com/login/oauth/authorize?client_id=' + env.githubAuthClientId
    }
  }
}
</script>
