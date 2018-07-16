/* eslint-disable import/first */

// Parse BIGINT fields (IDs) as numbers instead of strings, limiting the max
// ID value to 2^53 instead of 2^63-1, but keeping ID a number in JavaScript.
// https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083
require('pg').defaults.parseInt8 = true

import Sequelize from 'sequelize'
import CODELAB_DB_HOST from '../../env/db-host'
import CODELAB_DB_PORT from '../../env/db-port'
import CODELAB_DB_USERNAME from '../../env/db-username'
import CODELAB_DB_PASSWORD from '../../env/db-password'

export default new Sequelize({
  host: CODELAB_DB_HOST,
  port: CODELAB_DB_PORT,
  username: CODELAB_DB_USERNAME,
  password: CODELAB_DB_PASSWORD,
  database: 'codelab',
  dialect: 'postgres',
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
