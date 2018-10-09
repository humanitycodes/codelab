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
  return new Date(`${datePart}T${timePart}Z`)
})

import Sequelize from 'sequelize'
import databaseUrl from '../../env/database-url'
import logSqlStatements from '../../env/log-sql-statements'

export default new Sequelize(
  databaseUrl,
  {
    dialect: 'postgres',
    timezone: 'UTC',
    logging: logSqlStatements ? console.log : false,
    benchmark: true,
    pool: {
      max: 18
    },
    operatorsAliases: false,
    define: {
      freezeTableName: true,
      timestamps: false,
      underscored: true,
      version: true
    }
  }
)
