import { DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import User from '../user'
import Lesson from '../lesson'
import CourseStudentPending from './student-pending'

// For table definition, see 20180605-02-initial-tables.sql
const Course = sequelize.define('course', {
  courseId: {
    field: 'course_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  courseKey: {
    field: 'course_key',
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  title: {
    field: 'title',
    type: DataTypes.TEXT,
    allowNull: true
  },
  credits: {
    field: 'credits',
    type: DataTypes.INTEGER,
    allowNull: true
  },
  startDate: {
    field: 'start_date',
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    field: 'end_date',
    type: DataTypes.DATE,
    allowNull: true
  },
  syllabus: {
    field: 'syllabus',
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'course'
})

// course_student relationships
Course.belongsToMany(User, {
  as: 'students',
  through: 'course_student',
  foreignKey: 'course_id',
  otherKey: 'user_id'
})

User.belongsToMany(Course, {
  as: 'enrolledCourses',
  through: 'course_student',
  foreignKey: 'user_id',
  otherKey: 'course_id'
})

// course_instructor relationships
Course.belongsToMany(User, {
  as: 'instructors',
  through: 'course_instructor',
  foreignKey: 'course_id',
  otherKey: 'user_id'
})

User.belongsToMany(Course, {
  as: 'instructedCourses',
  through: 'course_instructor',
  foreignKey: 'user_id',
  otherKey: 'course_id'
})

// course_lesson relationships
Course.belongsToMany(Lesson, {
  as: 'lessons',
  through: 'course_lesson',
  foreignKey: 'course_id',
  otherKey: 'lesson_id'
})

Lesson.belongsToMany(Course, {
  as: 'courses',
  through: 'course_lesson',
  foreignKey: 'lesson_id',
  otherKey: 'course_id'
})

// course_student_pending relationship
Course.hasMany(CourseStudentPending, {
  as: 'pendingStudents',
  foreignKey: 'courseId',
  sourceKey: 'courseId'
})

export default Course
