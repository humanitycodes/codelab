import Vue from 'vue'
import App from './app'
import store from '@state/store'
import router from '@plugins/router'
import db from '@plugins/firebase'
import LoadingScreen from '@components/loading-screen'
import createFirebaseModule from '../../firebase/dist/adapter'

// Show a loading message until we have the data needed
// to authorize routes in our app
new Vue(LoadingScreen).$mount('#app') // eslint-disable-line no-new

// Once we have the information used to authorize
// routes, we can run the main app
store.dispatch('syncCurrentUser')
.then(state => {
  store.registerModule(
    'firebase',
    createFirebaseModule(
      store,
      db,
      store.state.users.currentUser && store.state.users.currentUser.uid,
      store.state.users.userRoles
    )
  )
  const additionalFetches = [store.dispatch('syncResources')]
  if (store.state.users.userRoles && store.state.users.userRoles.instructor) {
    additionalFetches.push(store.dispatch('syncUsers'))
  }
  return Promise.all(additionalFetches)
  // if (state.users.currentUser) {
  //   return Promise.all([
  //     store.dispatch('syncLessons'),
  //     store.dispatch('syncCourses')
  //   ])
  // }
  // return Promise.resolve()
})
.then(() => {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    store,
    router,
    render: h => h(App)
  })
})
