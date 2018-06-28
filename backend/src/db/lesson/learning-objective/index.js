import { DataTypes } from 'sequelize'
import sequelize from '../../sequelize'

// For table definition, see 20180605-02-initial-tables.sql
const LessonLearningObjective = sequelize.define('lessonLearningObjective', {
  lessonLearningObjectiveId: {
    field: 'lesson_learning_objective_id',
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
  tableName: 'lesson_learning_objective'
})

export default LessonLearningObjective
