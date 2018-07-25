import Lesson from './index'

export default (lessonId, options) => Lesson.findById(lessonId, options)
