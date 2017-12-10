<template>
  <Layout>
    <h1>Code Reviews</h1>
    <CodeReviews :courses="availableCourses"/>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/main'
import CodeReviews from '@components/code-reviews'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CodeReviews
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
