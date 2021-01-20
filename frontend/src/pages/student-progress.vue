<template>
  <Layout>
    <h1>Student Progress</h1>

    <Expander title="Your Active Courses">
      <CourseProgressReportsList :courses="activeCourses"/>
    </Expander>

    <Expander title="Other Courses" :expanded="false">
      <CourseProgressReportsList :courses="otherCourses"/>
    </Expander>
  </Layout>
</template>

<script>
import store from '@state/store'
import { courseGetters, userGetters } from '@state/helpers'
import Layout from '@layouts/main'
import CourseProgressReportsList from '@components/course-reports-progress-list'
import Expander from '@components/expander'

export default {
  beforeRouteEnter (to, from, next) {
    store.dispatch('syncResourceJournal').then(() => next())
  },
  components: {
    CourseProgressReportsList, Expander, Layout
  },
  computed: {
    ...courseGetters,
    ...userGetters,
    activeCourses () {
      return this.courses.filter(course =>
        this.isInstructorInCourse(course) && this.isActiveCourse(course)
      )
    },
    otherCourses () {
      return this.courses.filter(course =>
        this.isInstructorInCourse(course) && !this.isActiveCourse(course)
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
