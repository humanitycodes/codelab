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
  operatorsAliases: false
})
