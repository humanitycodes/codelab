import Vue from 'vue'
import App from './app'
import router from '@plugins/router'

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  render: h => h(App)
})
