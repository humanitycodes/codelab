import { keys, get, del } from 'idb-keyval'
import store from '@state/store'

const syncAction = {
  'course': 'syncCourse',
  'lesson': 'syncLesson'
}

export default async () => {
  const resourceIds = await keys()

  resourceIds.map(async resourceId => {
    try {
      const resourceType = await get(resourceId)
      await store.dispatch(syncAction[resourceType], resourceId)
      await del(resourceId)
    } catch (error) {
      console.warn(`Unable to sync resource ${resourceId}. Skipping.`)
    }
  })
}
