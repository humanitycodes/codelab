import Lesson from './index'
import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'

export default options => Lesson.findAll({
  ...options,
  include: [
    {
      model: LessonLearningObjective,
      as: 'learningObjectives'
    },
    {
      model: LessonProjectCriterion,
      as: 'projectCriteria'
    },
    {
      model: Lesson,
      as: 'prerequisiteLessons'
    }
  ]
})
