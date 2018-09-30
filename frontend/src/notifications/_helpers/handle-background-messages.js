import { set } from 'idb-keyval'
import messaging from '../messaging'
import getResourceIdFromPayload from './get-resource-id-from-payload'

if (messaging) {
  messaging.setBackgroundMessageHandler(payload => {
    console.log('Got background message:', payload)

    const { resourceType } = payload.data
    let resourceId = getResourceIdFromPayload(payload)
    if (isNaN(resourceId)) {
      const { resource } = payload.data
      if (resourceType === 'course') {
        resourceId = resource.courseId
      } else if (resourceType === 'lesson') {
        resourceId = resource.lessonId
      } else if (resourceType === 'project-completion') {
        resourceId = resource.projectCompletionId
      } else {
        console.warn('Unrecognized resource type:', resourceType)
        return
      }
    }

    // Save the timestamp that this resource changed so the app can
    // re-sync data when it becomes active
    const timestamp = Date.now()
    set(resourceId.toString(), { resourceType, timestamp })
  })
}
