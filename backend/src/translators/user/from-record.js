export default ({ authUser, userRecord }) => {
  // A user has full access to their own record
  if (authUser && authUser.userId === userRecord.userId) return userRecord.get()

  // Whitelist of fields that are available to clients
  return {
    userId: userRecord.userId,
    email: userRecord.email,
    fullName: userRecord.fullName,
    githubLogin: userRecord.githubLogin,
    isInstructor: userRecord.isInstructor,
    version: userRecord.version
  }
}
