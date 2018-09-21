import ifvisible from 'ifvisible'
import syncDirtyResources from './sync-dirty-resources'

export default () => ifvisible.wakeup(syncDirtyResources)
