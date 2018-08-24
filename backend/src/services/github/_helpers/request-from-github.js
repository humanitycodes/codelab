import axios from 'axios'
import retry from 'retry-as-promised'

const githubAuthBaseUrl = 'https://api.github.com'
const maxAttempts = 9

export default async ({
  method,
  path,
  token,
  body,
  attempts = maxAttempts
}) => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`
  }
  if (!body) headers['Content-Length'] = 0

  const params = {
    method,
    headers,
    url: `${githubAuthBaseUrl}${path}`
  }
  if (body) params.data = body

  // Constrain the number of attempts
  if (attempts <= 0) {
    attempts = 1
  } else if (attempts > maxAttempts) {
    attempts = maxAttempts
  }

  // With attempts = 9, backoffBase = 100, backoffExp = 1.1
  // the max duration of a request including all retries is 34,253 ms
  return retry(() => axios(params), attempts)
    .then(response => response.data)
    .catch(error => {
      throw new Error(
        `${method.toUpperCase()} ${path} failed.`,
        'Reason:', error
      )
    })
}
