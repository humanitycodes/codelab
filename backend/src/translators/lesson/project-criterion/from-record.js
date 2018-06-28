export default ({ lessonProjectCriterionRecord }) => {
  // Whitelist of fields that are available to clients
  return {
    lessonProjectCriterionId: lessonProjectCriterionRecord.lessonProjectCriterionId,
    lessonId: lessonProjectCriterionRecord.lessonId,
    position: lessonProjectCriterionRecord.position,
    content: lessonProjectCriterionRecord.content,
    version: lessonProjectCriterionRecord.version
  }
}
