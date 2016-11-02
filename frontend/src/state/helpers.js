import { mapState, mapGetters } from 'vuex'

export const userHelpers = {
  ...mapState({ currentUser: state => state.users.currentUser }),
  ...mapGetters(['userSignedIn', 'userIsStudent', 'userIsInstructor', 'userIsAdmin'])
}
