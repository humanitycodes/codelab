export default payload => {
  if (!payload || !payload.data) return

  const { resourceType, resourceId, resource } = payload.data
  if (resourceId) {
    return resourceId
  } else {
    const resourceValue = JSON.parse(resource)
    switch (resourceType) {
      case 'course':
        return resourceValue.courseId
      case 'lesson':
        return resourceValue.lessonId
      case 'project-completion':
        return resourceValue.projectCompletionId
      case 'user':
        return resourceValue.userId
    }
  }
}
