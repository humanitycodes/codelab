export default ({ payload }) => {
  // Whitelist fields that will be translated
  const lesson = {
    lessonId: payload.lessonId,
    lessonKey: payload.lessonKey,
    title: payload.title,
    estimatedHours: payload.estimatedHours,
    content: payload.content,
    notes: payload.notes,
    projectKey: payload.projectKey,
    projectTitle: payload.projectTitle,
    projectHosting: payload.projectHosting,
    version: payload.version
  }

  return lesson
}
