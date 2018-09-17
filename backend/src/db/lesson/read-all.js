import Lesson from './index'
import largeLessonFields from './large-fields'

export default options => Lesson.findAll({
  ...options,
  attributes: {
    exclude: largeLessonFields
  }
})
