import store from '@state/store'

export default courseId => {
  return store.getters.courses.find(course => course.courseId === courseId)
}
