import mapAndMerge from '../utils/map-and-merge'
import roles from './roles'
import { userSignedIn, hasRole } from '../generators/conditions'

export default name => {
  return {
    public: true,
    authed: userSignedIn,
    student: `root.child('${name}/relationships/'+$${name}Key+'/students/'+auth.uid).exists()`,
    ...mapAndMerge(roles, role => ({ [role]: hasRole(role) }))
  }
}
