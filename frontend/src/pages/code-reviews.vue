<template>
  <Layout>
    <h1>Code Reviews</h1>
    <CoursesCodeReviews :courses="availableCourses"/>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/main'
import CoursesCodeReviews from '@components/code-reviews-courses'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CoursesCodeReviews
  },
  created () {
    store.dispatch('getAllCourses')
  },
  computed: {
    ...courseGetters,
    availableCourses () {
      const currentUserId = store.state.users.currentUser.userId
      return this.courses.filter(
        course => course.instructors.some(user => user.userId === currentUserId)
      )
    }
  }
}
</script>
