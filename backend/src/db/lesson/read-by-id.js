import Lesson from './index'

export default (lessonId, options) => Lesson.findByPk(lessonId, options)
