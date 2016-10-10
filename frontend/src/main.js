import Vue from 'vue'
import router from '@plugins/router'
import '@plugins/firebase'

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  render: h => h('router-view')
})
