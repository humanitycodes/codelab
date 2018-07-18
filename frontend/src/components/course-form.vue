<template>
  <div v-if="course">
    <CourseTitle :course="course"/>
    <CourseCredits :course="course"/>
    <CourseDates :course="course"/>
    <CourseSyllabus :course="course"/>
    <CourseLessons :course="course"/>
    <CourseInstructors :course="course"/>
    <CourseStudents :course="course" :disabled="!isReadyForStudents"/>
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
    CourseTitle, CourseDates, CourseCredits, CourseSyllabus, CourseLessons, CourseInstructors, CourseStudents
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    isReadyForStudents () {
      return (
        this.course.studentIds.length ||
        this.course.pendingStudentEmails.length
      ) || (
        this.course.title &&
        this.course.credits && this.course.credits > 0 &&
        this.course.startDate &&
        this.course.endDate &&
        this.course.startDate < this.course.endDate &&
        this.course.lessonIds.length
      )
    }
  }
}
</script>
