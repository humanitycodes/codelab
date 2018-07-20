// A connection string for a Postgres 10 database.
// For example: postgres://user:pass@host:port/database
// https://www.postgresql.org/docs/current/static/libpq-connect.html
module.exports =
  process.env.DATABASE_URL ||
  [
    'postgres://',
    require('./db-username'),
    ':',
    encodeURIComponent(require('./db-password')),
    '@',
    require('./db-host'),
    ':',
    require('./db-port'),
    '/',
    require('./db-name')
  ].join('')
