<template>
  <div>
    <CoursesList
      title="Your Active Courses"
      :courses="instructorActiveCourses"
    />
    <CoursesList
      title="Other Courses"
      :courses="otherCourses"
    />
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'
import CoursesList from '@components/courses-list'

export default {
  components: {
    CoursesList
  },
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...userGetters,
    instructorActiveCourses () {
      return this.courses.filter(course =>
        this.isInstructorInCourse(course) && this.isActiveCourse(course)
      )
    },
    otherCourses () {
      return this.courses.filter(course =>
        !this.isInstructorInCourse(course) || !this.isActiveCourse(course)
      )
    }
  },
  methods: {
    isActiveCourse (course) {
      return !course.endDate || Date.now() < course.endDate
    },
    isInstructorInCourse (course) {
      return course.instructorIds.includes(this.currentUser.userId)
    }
  }
}
</script>
