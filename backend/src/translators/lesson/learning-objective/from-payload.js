export default ({ payload }) => {
  // Whitelist of fields that are available to clients
  return {
    lessonLearningObjectiveId: payload.lessonLearningObjectiveId,
    lessonId: payload.lessonId,
    position: payload.position,
    content: payload.content,
    version: payload.version
  }
}
