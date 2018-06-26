/* eslint-disable import/first */

// Parse BIGINT fields (IDs) as numbers instead of strings, limiting the max
// ID value to 2^53 instead of 2^63-1, but keeping ID a number in JavaScript.
// https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083
require('pg').defaults.parseInt8 = true

import Sequelize from 'sequelize'
import { config } from '../../env/config'

export default new Sequelize({
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
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
