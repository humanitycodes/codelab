import store from './store'

let storeInitialized = false

export default () => {
  if (storeInitialized) return Promise.resolve(store)
  storeInitialized = true
  const additionalFetches = []
  return Promise.all(additionalFetches).then(() => store)
}
