import Lesson from './index'
import LessonLearningObjective from './learning-objective'

export default options => Lesson.findAll({
  ...options,
  include: [
    {
      model: LessonLearningObjective,
      as: 'learningObjectives'
    }
  ]
})
