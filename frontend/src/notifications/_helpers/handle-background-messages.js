import { set } from 'idb-keyval'
import messaging from '../messaging'
import getResourceIdFromPayload from './get-resource-id-from-payload'

if (messaging) {
  messaging.setBackgroundMessageHandler(payload => {
    const resourceId = getResourceIdFromPayload(payload)
    if (isNaN(resourceId)) return

    // Save the timestamp that this resource changed so the app can
    // re-sync data when it becomes active
    const timestamp = Date.now()
    const { resourceType } = payload.data
    set(resourceId.toString(), { resourceType, timestamp })
  })
}
