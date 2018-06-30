export default ({ payload }) => {
  // Whitelist of fields that are available to clients
  return {
    lessonProjectCriterionId: payload.lessonProjectCriterionId,
    lessonId: payload.lessonId,
    position: payload.position,
    content: payload.content,
    version: payload.version
  }
}
