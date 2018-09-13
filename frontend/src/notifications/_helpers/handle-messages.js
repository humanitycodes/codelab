import messaging from '../messaging'
import store from '@state/store'

export default () => {
  return Promise.resolve(
    messaging.onMessage(payload => {
      // Firebase handles notification-only messages
      if (!payload.data) return

      const { action, resourceType } = payload.data
      const resource = JSON.parse(payload.data.resource)

      if (resourceType === 'course') {
        if (action === 'created' || action === 'updated') {
          store.dispatch('mergeCourses', [resource])
        } else if (action === 'deleted') {
          store.dispatch('removeCourses', [resource.courseId])
        }
      } else if (resourceType === 'lesson') {
        if (action === 'created' || action === 'updated') {
          store.dispatch('mergeLessons', [resource])
        } else if (action === 'deleted') {
          store.dispatch('removeLessons', [resource.lessonId])
        }
      } else if (resourceType === 'project-completion') {
        if (action === 'created' || action === 'updated') {
          store.dispatch('mergeProjectCompletions', [resource])
        } else if (action === 'deleted') {
          store.dispatch(
            'removeProjectCompletions',
            [resource.projectCompletionId]
          )
        }
      }
    })
  )
}
