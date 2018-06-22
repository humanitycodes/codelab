// This function is called to perform additional verification
// after hapi-auth-jwt2 verifies the JWT with the secret key
export default (decoded, request, h) => {
  return { isValid: true }
}
