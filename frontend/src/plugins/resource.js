import Vue from 'vue'
import VueResource from 'vue-resource'

export function initHttp (store) {
  Vue.use(VueResource)

  Vue.http.options.root = '/api'

  Vue.http.interceptors.push((request, next) => {
    const currentUser = store.state.users.currentUser
    request.headers.set('Authorization', currentUser ? currentUser.firebaseJwt : '')
    next()
  })
}
