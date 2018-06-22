import postToGitHub from './_helpers/post-to-github'
import { config } from '../../../env/config'
import githubEventHandlers from '../../helpers/github-event-handlers'

export default async (token, { owner, repo }) =>
  postToGitHub(`/repos/${owner}/${repo}/hooks`, token, {
    name: 'web',
    active: true,
    events: Object.keys(githubEventHandlers),
    config: {
      url: `${config.githubEventsBaseURL}${config.githubEventsPath}`,
      content_type: 'json'
    }
  })
