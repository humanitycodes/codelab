import store from '@state/store'

export default userId => {
  const { currentUser } = store.state.users
  if (currentUser.userId === userId) return currentUser
  return store.state.users.all.find(user => user.userId === userId)
}
