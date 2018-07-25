import Lesson from './index'

export default (lessonKey, options) => Lesson.findOne({
  ...options,
  where: {
    lessonKey
  }
})
