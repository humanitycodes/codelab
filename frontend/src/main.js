import Vue from 'vue'
import App from './app'
import store from '@state/store'
import router from '@plugins/router'

store.dispatch('syncCurrentUser')

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  router,
  render: h => h(App)
})
