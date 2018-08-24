import postToGitHub from './_helpers/post-to-github'
import githubEventsPathSecret from '../../../env/github-events-path-secret'
import serverBaseUrl from '../../../env/server-base-url'
import githubEventHandlerMap from 'routes/api/github-events/_helpers/github-event-handler-map'

export default async (token, { owner, repo }) =>
  postToGitHub(`/repos/${owner}/${repo}/hooks`, token, {
    name: 'web',
    active: true,
    events: Object.keys(githubEventHandlerMap),
    config: {
      url: [
        serverBaseUrl,
        'api/github-events',
        githubEventsPathSecret
      ].join('/'),
      content_type: 'json'
    }
  })
