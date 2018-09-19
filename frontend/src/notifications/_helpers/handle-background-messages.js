import { set } from 'idb-keyval'
import messaging from '../messaging'

if (messaging) {
  messaging.setBackgroundMessageHandler(payload => {
    if (!payload.data) return

    const { resourceType, resourceId, resource } = payload.data
    if (resourceId) {
      set(resourceId, resourceType)
    } else {
      switch (resourceType) {
        case 'course':
          set(resource.courseId, resourceType)
          break
        case 'lesson':
          set(resource.lessonId, resourceType)
          break
        case 'project-completion':
          set(resource.projectCompletionId, resourceType)
          break
        case 'user':
          set(resource.userId, resourceType)
          break
      }
    }
  })
}
