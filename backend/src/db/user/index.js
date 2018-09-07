import { DataTypes } from 'sequelize'
import sequelize from '../sequelize'

// For table definition, see 20180605-02-initial-tables.sql
const User = sequelize.define('user', {
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    field: 'email',
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  fullName: {
    field: 'full_name',
    type: DataTypes.TEXT,
    allowNull: false
  },
  isInstructor: {
    field: 'role_instructor',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  githubLogin: {
    field: 'github_login',
    type: DataTypes.TEXT,
    allowNull: true
  },
  githubScope: {
    field: 'github_scope',
    type: DataTypes.TEXT,
    allowNull: true
  },
  githubToken: {
    field: 'github_token',
    type: DataTypes.TEXT,
    allowNull: true
  },
  githubTokenType: {
    field: 'github_token_type',
    type: DataTypes.TEXT,
    allowNull: true
  },
  githubUserId: {
    field: 'github_user_id',
    type: DataTypes.BIGINT,
    allowNull: true
  },
  msuUid: {
    field: 'msu_uid',
    type: DataTypes.TEXT,
    allowNull: true
  },
  messagingToken: {
    field: 'messaging_token',
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'app_user'
})

export default User
