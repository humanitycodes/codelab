import { DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import Course from '../course'

// For table definition, see 20180605-02-initial-tables.sql
const ProjectCompletion = sequelize.define('projectCompletion', {
  projectCompletionId: {
    field: 'project_completion_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    field: 'course_id',
    type: DataTypes.BIGINT,
    allowNull: false
  },
  lessonId: {
    field: 'lesson_id',
    type: DataTypes.BIGINT,
    allowNull: false
  },
  studentUserId: {
    field: 'student_user_id',
    type: DataTypes.BIGINT,
    allowNull: false
  },
  instructorUserId: {
    field: 'instructor_user_id',
    type: DataTypes.BIGINT,
    allowNull: true
  },
  repositoryCreatedAt: {
    field: 'repository_created_at',
    type: DataTypes.DATE,
    allowNull: false
  },
  approved: {
    field: 'approved',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  committed: {
    field: 'committed',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  instructorCommentedLast: {
    field: 'instructor_commented_last',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  firstCommittedAt: {
    field: 'first_committed_at',
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedAt: {
    field: 'approved_at',
    type: DataTypes.DATE,
    allowNull: true
  },
  firstSubmittedAt: {
    field: 'first_submitted_at',
    type: DataTypes.DATE,
    allowNull: true
  },
  lastCommentedAt: {
    field: 'last_commented_at',
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'project_completion'
})

ProjectCompletion.belongsTo(Course, { foreignKey: 'courseId' })

export default ProjectCompletion
