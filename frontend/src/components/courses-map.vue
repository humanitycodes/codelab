<template>
  <div>
    <Expander title="Your Active Courses">
      <CoursesList :courses="activeCourses"/>
    </Expander>

    <Expander title="Other Courses" :expanded="false">
      <CoursesList :courses="otherCourses"/>
    </Expander>
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'
import CoursesList from '@components/courses-list'
import Expander from '@components/expander'

export default {
  components: {
    CoursesList, Expander
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
