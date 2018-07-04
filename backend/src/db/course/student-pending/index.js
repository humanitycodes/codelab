import { DataTypes } from 'sequelize'
import sequelize from '../../sequelize'

// For table definition, see 20180605-02-initial-tables.sql
const CourseStudentPending = sequelize.define('courseStudentPending', {
  courseId: {
    field: 'course_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  email: {
    field: 'email',
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'course_student_pending'
})

export default CourseStudentPending
