import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'

export default async (lessonRecord, options) => {
  // Delete foreign keys first
  await [
    LessonLearningObjective.destroy({
      ...options,
      where: {
        lessonId: lessonRecord.lessonId
      }
    }),
    LessonProjectCriterion.destroy({
      ...options,
      where: {
        lessonId: lessonRecord.lessonId
      }
    })
  ]

  await lessonRecord.destroy(options)
}
