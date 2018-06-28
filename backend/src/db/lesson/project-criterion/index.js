import { DataTypes } from 'sequelize'
import sequelize from '../../sequelize'

// For table definition, see 20180605-02-initial-tables.sql
const LessonProjectCriterion = sequelize.define('lessonProjectCriterion', {
  lessonProjectCriterionId: {
    field: 'lesson_project_criterion_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  lessonId: {
    field: 'lesson_id',
    type: DataTypes.BIGINT,
    allowNull: false
  },
  position: {
    field: 'position',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    field: 'content',
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'lesson_project_criterion'
})

export default LessonProjectCriterion
