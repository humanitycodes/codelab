import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'

export default async (lessonRecord, options) => {
  // Delete foreign keys first
  const removeRelationships = [
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
  if (lessonRecord.prerequisiteLessons) {
    removeRelationships.push(
      lessonRecord.removePrerequisiteLessons(
        lessonRecord.prerequisiteLessons
      )
    )
  }
  return Promise.all(removeRelationships)
    .then(() => lessonRecord.destroy(options))
}