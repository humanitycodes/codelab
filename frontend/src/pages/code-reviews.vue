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
  computed: {
    ...courseGetters,
    availableCourses () {
      const currentUserKey = store.state.users.currentUser.uid
      return this.courses.filter(
        course => course.instructorKeys.indexOf(currentUserKey) !== -1
      )
    }
  }
}
</script>
