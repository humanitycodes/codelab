import store from '@state/store'

export default key => {
  const { currentUser } = store.state.users
  if (currentUser.uid === key) {
    return currentUser.profile
  }
  return store.state.users.all
    .find(user => (
      // The key is on uid for the currently signed in user, .key for all others
      user.uid === key ||
      user['.key'] === key
    ))
}
