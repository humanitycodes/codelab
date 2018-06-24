import store from './store'

let storeInitialized = false

export default () => {
  if (storeInitialized) return Promise.resolve(store)
  storeInitialized = true
  return store.dispatch('attemptAutoSignIn').then(currentUser => {
    if (!currentUser) return Promise.resolve(store)
    return Promise.all([
      store.dispatch('getAllCourses')
    ]).then(() => store)
  })
}
