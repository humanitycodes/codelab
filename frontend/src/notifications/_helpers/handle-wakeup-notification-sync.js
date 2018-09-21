import ifvisible from 'ifvisible'
import syncStoredResources from './sync-stored-resources'

export default () => ifvisible.wakeup(syncStoredResources)
