<template>
  <nav id="user-menu" aria-label="User Menu">
    <header aria-haspopup="true">
      <a ref="collapsed-header" @click="toggleMenu" href="javascript:void(0)">
        <span>{{ currentUser.fullName }}</span><span
          class="ml-1 fas fa-caret-down"
          role="img"
        ></span>
      </a>
    </header>
    <section :aria-expanded="showMenu || 'false'">
      <header>
        <a ref="expanded-header" @click="toggleMenu" href="javascript:void(0)">
          <span v-html="currentUser.fullName"></span><span
            class="ml-1 fas fa-caret-down"
            role="img"
          ></span>
        </a>
      </header>
      <ol>
        <li>
          <router-link to="/profile">
            Profile
          </router-link>
        </li>
        <li v-if="hasNewGitHubScopes">
          <AuthLink provider="github">
            {{ connectGitHubLabel }}
          </AuthLink>
        </li>
        <li>
          <router-link to="/sign-out">
            Sign out
          </router-link>
        </li>
      </ol>
    </section>
  </nav>
</template>

<script>
import { userGetters } from '@state/helpers'
import AuthLink from '@components/auth-link'

export default {
  components: {
    AuthLink
  },
  data () {
    return {
      showMenu: false
    }
  },
  mounted () {
    document.addEventListener('click', this.hideMenu)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.hideMenu)
  },
  computed: {
    ...userGetters,
    connectGitHubLabel () {
      return this.currentUser.githubLogin
        ? 'Reconnect GitHub'
        : 'Connect GitHub'
    }
  },
  methods: {
    toggleMenu () {
      this.showMenu = !this.showMenu
      const headerRef = this.showMenu ? 'expanded-header' : 'collapsed-header'
      this.$nextTick(() => this.$refs[headerRef].focus())
    },
    hideMenu (e) {
      if (!this.$el.contains(e.target)) {
        this.showMenu = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

$halfGutterWidth = $design.layout.gutterWidth * .5

nav
  position: relative
  border-left: 1px solid $design.control.border.color
  padding-left: $design.layout.gutterWidth
  section
    display: none
  section[aria-expanded='true']
    display: block
    position: absolute
    top: 0
    left: $halfGutterWidth
    margin-top: -($halfGutterWidth)
    border-radius: $design.control.border.radius
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
    background-color: $design.branding.default.light
    border: 1px solid $design.control.border.color
    padding: $halfGutterWidth
  ol
    list-style-type: none
    border-top: 1px solid $design.control.border.color
    padding: $halfGutterWidth $halfGutterWidth 0
    margin-top: $halfGutterWidth
</style>
