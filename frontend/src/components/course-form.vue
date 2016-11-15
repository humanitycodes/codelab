<template>
  <div v-if="course">
    <CourseTitle :course="course"/>
    <CourseCredits :course="course"/>
    <CourseDates :course="course"/>
    <CourseSyllabus :course="course"/>
    <CourseLessons :course="course"/>
    <CourseStudents :course="course" :disabled="!isReadyForStudents"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CourseTitle from './course-form-title'
import CourseDates from './course-form-dates'
import CourseCredits from './course-form-credits'
import CourseSyllabus from './course-form-syllabus'
import CourseLessons from './course-form-lessons'
import CourseStudents from './course-form-students'

export default {
  components: {
    CourseTitle, CourseDates, CourseCredits, CourseSyllabus, CourseLessons, CourseStudents
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    isReadyForStudents () {
      return !!this.course.studentKeys || (
        this.course.title &&
        this.course.credits && this.course.credits > 0 &&
        this.course.syllabus &&
        this.course.startDate &&
        this.course.endDate &&
        Date.parse(this.course.startDate) < Date.parse(this.course.endDate) &&
        this.course.lessonKeys
      )
    }
  },
  created () {
    this.updateCourse(this.course)
  },
  watch: {
    course: {
      deep: true,
      handler (newCourse) {
        console.log(newCourse)
        // this.updateCourse(newCourse)
      }
    }
  },
  methods: mapActions(['updateCourse'])
}
</script>
