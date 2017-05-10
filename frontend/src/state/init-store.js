import store from './store'
import createFirebaseModule from '@src/../../firebase/dist/adapter'
import db from '@plugins/firebase'

let storeInitialized = false
export default () => {
  if (storeInitialized) return Promise.resolve(store)
  storeInitialized = true
  return store.dispatch('syncCurrentUser').then(state => {
    if (!state.users.currentUser) return Promise.resolve(store)
    storeInitialized = true
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
      additionalFetches.push(store.dispatch('syncRoles'))
    }
    return Promise.all(additionalFetches).then(() => store)
  })
}
