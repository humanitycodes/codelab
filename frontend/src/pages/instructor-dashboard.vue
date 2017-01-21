<template>
  <Layout>
    <h1>Code Reviews</h1>
    <CodeReviews :courses="courses"/>

    <h1>Course Progress</h1>
    <div v-for="course in sortByCourseKey(courses)">
      <h2>{{ course['.key'] }}</h2>
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CodeReviews from '@components/code-reviews'
import { courseGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    Layout, CodeReviews
  },
  methods: {
    sortByCourseKey (courses) {
      return sortBy(courses, [course => course['.key']])
    }
  },
  computed: courseGetters
}
</script>
