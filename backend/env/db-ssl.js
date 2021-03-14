// Use SSL in production where Heroku requires it
module.exports = process.env.NODE_ENV === 'production'
