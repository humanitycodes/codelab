// Set by Heroku automatically to indicate how many cores are available to
// the server if it wants to create additional workers.
module.exports = parseInt(process.env.WEB_CONCURRENCY) || 1
