import Lesson from './index'
import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'
import Course from '../course'
import User from '../user'

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
    },
    {
      model: Course,
      as: 'courses',
      // Don't eagerly fetch large fields of course
      attributes: ['courseId'],
      // The lesson must have a course with a student matching the provided userId
      required: true,
      include: [
        {
          model: User,
          as: 'students',
          required: true,
          where: {
            userId
          }
        }
      ]
    }
  ]
})
