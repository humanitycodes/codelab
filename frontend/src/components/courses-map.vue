<template>
  <div>
    <CoursesList
      title="Your Active Courses"
      :courses="activeCourses"
    />
    <CoursesList
      title="Other Courses"
      :courses="otherCourses"
      :expanded="false"
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
    activeCourses () {
      return this.courses.filter(course =>
        this.isCurrentUserInCourse(course) && this.isActiveCourse(course)
      )
    },
    otherCourses () {
      return this.courses.filter(course =>
        !this.isCurrentUserInCourse(course) || !this.isActiveCourse(course)
      )
    }
  },
  methods: {
    isActiveCourse (course) {
      return !course.endDate || Date.now() < course.endDate
    },
    isCurrentUserInCourse (course) {
      return course.instructorIds.includes(this.currentUser.userId) ||
        course.studentIds.includes(this.currentUser.userId)
    }
  }
}
</script>
