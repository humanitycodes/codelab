import store from './store'

let storeInitialized = false

export default () => {
  if (storeInitialized) return Promise.resolve(store)
  storeInitialized = true
  return store.dispatch('attemptAutoSignIn').then(() => store)
}
