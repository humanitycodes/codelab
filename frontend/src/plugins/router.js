import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../routes'
import store from '@state/store'
import { sync as vuexRouterSync } from 'vuex-router-sync'

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})

// Check each method for an `isAuthorized` function
// and run it if one exists. Otherwise, redirect to
// root.
router.beforeEach((to, from, next) => {
  const { isAuthorized } = to.meta
  return !isAuthorized || isAuthorized(to.params)
    ? next() : next('/')
})

// Adds a `route` object on `store.state`, which is
// kept up-to-date by Vue Router. This is useful
// when we want to use route information in computed
// getters.
vuexRouterSync(store, router)

export default router
