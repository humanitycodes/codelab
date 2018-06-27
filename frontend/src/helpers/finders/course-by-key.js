import store from '@state/store'

export default key => {
  return store.getters.courses.find(course => course.courseKey === key)
}
