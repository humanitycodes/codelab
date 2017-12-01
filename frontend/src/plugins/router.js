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

// Check each method for an `isAuthorized` function
// and run it if one exists. Otherwise, redirect to
// root.
router.beforeEach((to, from, next) => {
  const { isAuthorized, isPublic } = to.meta
  if (!isPublic && !store.state.users.currentUser) {
    return next('/')
  }
  return !isAuthorized || isAuthorized(to.params)
    ? next() : next({ name: 'not-found', params: [to.path] })
})

// Adds a `route` object on `store.state`, which is
// kept up-to-date by Vue Router. This is useful
// when we want to use route information in computed
// getters.
vuexRouterSync(store, router)

export default router
