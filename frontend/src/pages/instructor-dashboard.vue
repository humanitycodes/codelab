<template>
  <Layout>
    <h1>Code Reviews</h1>
    <CodeReviews :courses="courses"/>

    <h1>Course Progress</h1>
    <CourseProgress v-for="course in sortByCourseKey(courses)" :course="course"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CodeReviews from '@components/code-reviews'
import CourseProgress from '@components/course-progress'
import { courseGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    Layout, CodeReviews, CourseProgress
  },
  methods: {
    sortByCourseKey (courses) {
      return sortBy(courses, [course => course['.key']])
    }
  },
  computed: courseGetters
}
</script>
