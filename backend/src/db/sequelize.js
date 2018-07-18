/* eslint-disable import/first */

const pg = require('pg')

// Parse BIGINT fields (IDs) as numbers instead of strings, limiting the max
// ID value to 2^53 instead of 2^63-1, but keeping ID a number in JavaScript.
// https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083
pg.defaults.parseInt8 = true

// Convert dates stored without timestamps to UTC dates, keeping the date and
// time elements intact.
// https://github.com/sequelize/sequelize/issues/3000
pg.types.setTypeParser(1114, dateString => {
  if (!dateString || !dateString.length) return null
  const [datePart, timePart] = dateString.split(' ')
  return new Date(new Date(`${datePart}T${timePart}Z`))
})

import Sequelize from 'sequelize'
import CODELAB_DB_HOST from '../../env/db-host'
import CODELAB_DB_PORT from '../../env/db-port'
import CODELAB_DB_USERNAME from '../../env/db-username'
import CODELAB_DB_PASSWORD from '../../env/db-password'
import CODELAB_LOG_SQL_STATEMENTS from '../../env/log-sql-statements'

export default new Sequelize({
  host: CODELAB_DB_HOST,
  port: CODELAB_DB_PORT,
  username: CODELAB_DB_USERNAME,
  password: CODELAB_DB_PASSWORD,
  database: 'codelab',
  dialect: 'postgres',
  timezone: 'UTC',
  logging: CODELAB_LOG_SQL_STATEMENTS ? console.log : false,
  pool: {
    max: 20
  },
  operatorsAliases: false,
  define: {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    version: true
  }
})
