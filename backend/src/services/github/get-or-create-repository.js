import getRepository from './get-repository'
import createRepository from './create-repository'

export default async (githubToken, { owner, repo }) => {
  try {
    return await getRepository(githubToken, { owner, repo })
  } catch (notfound) {
    return createRepository(githubToken, { name: repo })
  }
}
