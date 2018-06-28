import Lesson from './index'
import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'
import Course from '../course'

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
      as: 'prerequisiteLessons',
      // Don't eagerly fetch large fields of prereq
      attributes: ['lessonId']
    },
    {
      model: Course,
      as: 'courses',
      // Don't eagerly fetch large fields of course
      attributes: ['courseId']
    }
  ]
})
