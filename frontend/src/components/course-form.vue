<template>
  <div>
    <CourseTitle v-on="$listeners" :title="title"/>
    <CourseCredits v-on="$listeners" :credits="credits"/>
    <CourseDates v-on="$listeners" :start-date="startDate" :end-date="endDate"/>
    <CourseSyllabus v-on="$listeners" :syllabus="syllabus"/>
    <CourseLessons
      v-on="$listeners"
      :course-id="courseId"
      :course-key="courseKey"
      :lesson-ids="lessonIds"
    />
    <CourseInstructors
      v-on="$listeners"
      :course-id="courseId"
      :instructor-ids="instructorIds"
    />
    <CourseStudents
      v-on="$listeners"
      :course-id="courseId"
      :student-ids="studentIds"
      :pending-student-emails="pendingStudentEmails"
      :disabled="!isReadyForStudents"
    />
  </div>
</template>

<script>
import CourseTitle from './course-form-title'
import CourseDates from './course-form-dates'
import CourseCredits from './course-form-credits'
import CourseSyllabus from './course-form-syllabus'
import CourseLessons from './course-form-lessons'
import CourseInstructors from './course-form-instructors'
import CourseStudents from './course-form-students'

export default {
  components: {
    CourseTitle,
    CourseDates,
    CourseCredits,
    CourseSyllabus,
    CourseLessons,
    CourseInstructors,
    CourseStudents
  },
  props: {
    courseId: Number,
    courseKey: String,
    title: String,
    credits: Number,
    startDate: Number,
    endDate: Number,
    syllabus: String,
    lessonIds: Array,
    instructorIds: Array,
    studentIds: Array,
    pendingStudentEmails: Array
  },
  computed: {
    isReadyForStudents () {
      return (
        this.studentIds.length ||
        this.pendingStudentEmails.length
      ) || (
        this.title &&
        this.credits && this.credits > 0 &&
        this.startDate &&
        this.endDate &&
        this.startDate < this.endDate &&
        this.lessonIds.length
      )
    }
  }
}
</script>
