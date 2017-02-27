import store from '@state/store'

export default key => {
  return store.getters.lessons
    .find(lesson => lesson['.key'] === key)
}
