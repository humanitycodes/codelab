export const verifyJWTOptions = {
  ignoreExpiration: true
}

export function verifyJWT (decoded, request, callback) {
  if (callback) {
    callback(null, !!decoded)
    return
  }
  return new Promise((resolve, reject) => {
    const valid = !!decoded
    if (valid) {
      resolve()
    } else {
      reject(new Error('Invalid credentials'))
    }
  })
}
