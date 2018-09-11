import { DataTypes } from 'sequelize'
import sequelize from '../sequelize'

// For table definition, see 20180907-01-user-messaging-tokens.sql
const UserMessagingToken = sequelize.define('userMessagingToken', {
  userMessagingTokenId: {
    field: 'user_messaging_token_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT,
    allowNull: false
  },
  messagingToken: {
    field: 'messaging_token',
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'user_messaging_token'
})

export default UserMessagingToken
