export default () => {
  const globalLog = require('global-request-logger')
  globalLog.initialize()

  globalLog.on('success', function (request, response) {
    console.log('SUCCESS')
    console.log('Request', request)
    console.log('Response', response)
  })

  globalLog.on('error', function (request, response) {
    console.log('ERROR')
    console.log('Request', request)
    console.log('Response', response)
  })
}
