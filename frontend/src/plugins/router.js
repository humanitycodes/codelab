import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../routes'
import store from '@state/store'
import { sync as vuexRouterSync } from 'vuex-router-sync'

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// Global route protection and redirection
router.beforeEach((to, from, next) => {
  const { isAuthorized, isPublic } = to.meta

  // Signed out and visiting a private page, show home page instead
  if (!isPublic && !store.state.users.currentUser) {
    return next('/')
  }

  // Signed in and visiting page without permission, show not found page
  if (isAuthorized && !isAuthorized(to.params)) {
    return next({ name: 'not-found', params: [to.path] })
  }

  // Signed in and additional account setup needed, show get started page
  if (
    !isPublic &&
    to.path !== '/get-started' &&
    store.getters.isUserSetupRequired
  ) {
    return next('/get-started')
  }

  return next()
})

// Adds a `route` object on `store.state`, which is
// kept up-to-date by Vue Router. This is useful
// when we want to use route information in computed
// getters.
vuexRouterSync(store, router)

export default router
