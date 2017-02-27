import store from '@state/store'

export default course => {
  return course.lessonKeys.map(lessonKey => {
    return store.getters.lessons.find(lesson => {
      return lesson['.key'] === lessonKey
    })
  })
}
