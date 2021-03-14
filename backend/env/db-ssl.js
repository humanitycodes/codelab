// Use SSL in Heroku environments
module.exports = process.env.CODELAB_DB_USE_SSL === 'true'
