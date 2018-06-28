import Lesson from './index'
import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'

export default (userId, options) => Lesson.findAll({
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
      as: 'prerequisiteLessons',
      // Don't eagerly fetch large fields of prereq
      attributes: ['lessonId']
    }
  ]
})
