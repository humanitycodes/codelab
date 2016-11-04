import Vue from 'vue'
import App from './app'
import store from '@state/store'
import router from '@plugins/router'
import LoadingScreen from '@components/loading-screen'

// Show a loading message until we have the data needed
// to authorize routes in our app
new Vue(LoadingScreen).$mount('#app') // eslint-disable-line no-new

// Once we have the information used to authorize
// routes, we can run the main app
store.dispatch('syncCurrentUser')
.then(state => {
  return state.users.currentUser
    ? store.dispatch('syncLessons')
    : Promise.resolve()
})
.then(() => {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    store,
    router,
    render: h => h(App)
  })
})
