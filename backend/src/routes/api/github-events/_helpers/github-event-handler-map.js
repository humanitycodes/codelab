export default {
  issue_comment: require('./events/issue-comment').default,
  issues: require('./events/issues').default,
  push: require('./events/push').default
}
