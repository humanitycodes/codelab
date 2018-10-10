<template>
  <Layout>
    <h1>Code Reviews</h1>
    <CoursesCodeReviews :courses="availableCourses"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CoursesCodeReviews from '@components/code-reviews-courses'
import { courseGetters, userGetters } from '@state/helpers'

export default {
  components: {
    Layout, CoursesCodeReviews
  },
  computed: {
    ...courseGetters,
    ...userGetters,
    availableCourses () {
      const currentUserId = this.currentUser.userId
      return this.courses.filter(
        course => course.instructorIds.some(userId => userId === currentUserId)
      )
    }
  }
}
</script>
