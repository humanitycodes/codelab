export default payload => {
  if (!payload || !payload.data) return

  const { resourceType, resourceId, resource } = payload.data
  if (resourceId) {
    return resourceId
  } else {
    switch (resourceType) {
      case 'course':
        return resource.courseId
      case 'lesson':
        return resource.lessonId
      case 'project-completion':
        return resource.projectCompletionId
      case 'user':
        return resource.userId
    }
  }
}
