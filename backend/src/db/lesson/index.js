import { DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import LessonLearningObjective from './learning-objective'
import LessonProjectCriterion from './project-criterion'

// For table definition, see 20180605-02-initial-tables.sql
const Lesson = sequelize.define('lesson', {
  lessonId: {
    field: 'lesson_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  lessonKey: {
    field: 'lesson_key',
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  title: {
    field: 'title',
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedHours: {
    field: 'estimated_hours',
    type: DataTypes.INTEGER,
    allowNull: true
  },
  content: {
    field: 'content',
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    field: 'notes',
    type: DataTypes.TEXT,
    allowNull: true
  },
  projectKey: {
    field: 'project_key',
    type: DataTypes.TEXT,
    allowNull: true
  },
  projectTitle: {
    field: 'project_title',
    type: DataTypes.TEXT,
    allowNull: true
  },
  projectHosting: {
    field: 'project_hosting',
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'lesson'
})

Lesson.hasMany(LessonLearningObjective, {
  as: 'learningObjectives',
  foreignKey: 'lessonId',
  sourceKey: 'lessonId'
})

Lesson.hasMany(LessonProjectCriterion, {
  as: 'projectCriteria',
  foreignKey: 'lessonId',
  sourceKey: 'lessonId'
})

Lesson.belongsToMany(Lesson, {
  as: 'prerequisiteLessons',
  through: 'lesson_prerequisite',
  foreignKey: 'lesson_id',
  otherKey: 'prerequisite_lesson_id'
})

export default Lesson
