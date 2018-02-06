<template>
  <Layout>
    <h1>Student Progress</h1>
    <CourseProgress v-for="course in coursesSortedByKey" :course="course" :key="course['.key']"/>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/main'
import CourseProgress from '@components/course-progress'
import { courseGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    Layout, CourseProgress
  },
  computed: {
    ...courseGetters,
    availableCourses () {
      const currentUserKey = store.state.users.currentUser.uid
      return this.courses.filter(
        course => course.instructorKeys.indexOf(currentUserKey) !== -1
      )
    },
    coursesSortedByKey () {
      return sortBy(this.availableCourses, [course => course['.key']])
    }
  }
}
</script>
