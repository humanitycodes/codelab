import translateLearningObjectiveFromRecord from './learning-objective/from-record'

export default ({ lessonRecord }) => {
  // Whitelist of fields that are available to clients
  let lesson = {
    lessonId: lessonRecord.lessonId,
    lessonKey: lessonRecord.lessonKey,
    title: lessonRecord.title,
    estimatedHours: lessonRecord.estimatedHours,
    content: lessonRecord.content,
    notes: lessonRecord.notes,
    projectTitle: lessonRecord.projectTitle,
    projectHosting: lessonRecord.projectHosting,
    learningObjectives: []
  }

  // Translate learning objectives
  if (lessonRecord.learningObjectives) {
    lesson.learningObjectives = lessonRecord.learningObjectives.map(
      lessonLearningObjectiveRecord => translateLearningObjectiveFromRecord({
        lessonLearningObjectiveRecord
      })
    )
  }

  return lesson
}
