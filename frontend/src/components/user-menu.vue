<template>
  <nav id="user-menu" aria-label="User Menu">
    <header aria-haspopup="true">
      <a @click="toggleMenu" href="javascript:void(0)">
        <span>{{ currentUser.fullName }}</span><span
          class="menu-indicator fas fa-caret-down"
          role="img"
        ></span>
      </a>
    </header>
    <section :aria-expanded="showMenu || 'false'">
      <ol>
        <li>
          <router-link to="/profile">
            Profile
          </router-link>
        </li>
        <li v-if="hasNewGitHubScopes">
          <AuthLink provider="github">
            Connect GitHub
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
    ...userGetters
  },
  methods: {
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    hideMenu (e) {
      // Hide menu when user clicks off the menu
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
$menuIndicatorOffset = .25rem
$menuPinWidth = .5rem
$menuOffset = -($menuPinWidth + $menuIndicatorOffset)

nav
  position: relative
  border-left: 1px solid $design.control.border.color
  padding-left: $design.layout.gutterWidth
  .menu-indicator
    margin-left: $menuIndicatorOffset
  section
    display: none
    &[aria-expanded='true']
      display: block
      position: absolute
      top: 30px
      right: $menuOffset
      border-radius: $design.control.border.radius
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, .33))
      background-color: $design.branding.default.light
      border: 1px solid $design.control.border.color
      padding: $halfGutterWidth
      z-index: 20
    > ol
      list-style-type: none
      padding: $halfGutterWidth
      &:after
        position: absolute
        right: $menuPinWidth
        margin-left: -($menuPinWidth)
        top: -($menuPinWidth)
        width: 0
        height: 0
        content: ''
        border-left: $menuPinWidth solid transparent
        border-right: $menuPinWidth solid transparent
        border-bottom: $menuPinWidth solid white
</style>
