import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'

export default async (lessonRecord, options) => {
  // Delete foreign keys first
  await LessonLearningObjective.destroy({
    ...options,
    where: {
      lessonId: lessonRecord.lessonId
    }
  })

  await LessonProjectCriterion.destroy({
    ...options,
    where: {
      lessonId: lessonRecord.lessonId
    }
  })

  const prerequisiteLessons = await lessonRecord.getPrerequisiteLessons(options)
  if (prerequisiteLessons.length) {
    await lessonRecord.removePrerequisiteLessons(
      prerequisiteLessons, options
    )
  }

  const courses = await lessonRecord.getCourses(options)
  if (courses.length) {
    await lessonRecord.removeCourses(courses, options)
  }

  await lessonRecord.destroy(options)
}
