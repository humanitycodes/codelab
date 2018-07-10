import postToGitHub from './_helpers/post-to-github'
import { config } from '../../../env/config'
import githubEventHandlerMap from 'routes/api/github-events/_helpers/github-event-handler-map'

export default async (token, { owner, repo }) =>
  postToGitHub(`/repos/${owner}/${repo}/hooks`, token, {
    name: 'web',
    active: true,
    events: Object.keys(githubEventHandlerMap),
    config: {
      url: `${config.githubEventsBaseURL}${config.githubEventsPath}`,
      content_type: 'json'
    }
  })
