export default ({ lessonLearningObjectiveRecord }) => {
  // Whitelist of fields that are available to clients
  return {
    lessonLearningObjectiveId: lessonLearningObjectiveRecord.lessonLearningObjectiveId,
    lessonId: lessonLearningObjectiveRecord.lessonId,
    position: lessonLearningObjectiveRecord.position,
    content: lessonLearningObjectiveRecord.content,
    version: lessonLearningObjectiveRecord.version
  }
}
