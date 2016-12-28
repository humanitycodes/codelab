export default {
  push: push => {
    console.log('Received push with payload', push)
  },

  issues: payload => {
    console.log('Received issue with payload', payload)
  },

  issue_comment: payload => {
    console.log('Received issue comment with payload', payload)
  }
}
