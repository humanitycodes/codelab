export default ({ payload }) => {
  // Whitelist fields that will be translated
  const user = {
    email: payload.email.trim().toLowerCase(),
    fullName: payload.fullName.trim(),
    isInstructor: !!payload.isInstructor
  }
  return user
}
