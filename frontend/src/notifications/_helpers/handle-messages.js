import messaging from '../messaging'
import store from '@state/store'

// Sample payloads:
// ----------------
// {
//   data: {
//     action: 'created',
//     resourceType: 'lesson',
//     resourceId: 432
//   }
// }
//
// {
//   data: {
//     action: 'updated',
//     resourceType: 'project-completion',
//     resource: {
//       projectCompletionId: 8745,
//       lessonId: 432,
//       courseId: 65,
//       ...
//     }
//   }
// }
export default () => {
  return Promise.resolve(
    messaging.onMessage(payload => {
      // Firebase handles notification-only messages
      if (!payload.data) return

      const { action, resourceType, resourceId } = payload.data
      const resource = resourceId ? null : JSON.parse(payload.data.resource)

      if (resourceType === 'course') {
        if (action === 'created' || action === 'updated') {
          if (resourceId) {
            store.dispatch('syncCourse', resourceId)
          } else {
            store.dispatch('mergeCourses', [resource])
          }
        } else if (action === 'deleted') {
          store.dispatch('removeCourses', [resourceId || resource.courseId])
        }
      } else if (resourceType === 'lesson') {
        if (action === 'created' || action === 'updated') {
          if (resourceId) {
            store.dispatch('syncLesson', resourceId)
          } else {
            store.dispatch('mergeLessons', [resource])
          }
        } else if (action === 'deleted') {
          store.dispatch('removeLessons', [resourceId || resource.lessonId])
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
