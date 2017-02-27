<template>
  <Layout>
    <h1>Student Progress</h1>
    <CourseProgress v-for="course in sortByCourseKey(courses)" :course="course"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CourseProgress from '@components/course-progress'
import { courseGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    Layout, CourseProgress
  },
  methods: {
    sortByCourseKey (courses) {
      return sortBy(courses, [course => course['.key']])
    }
  },
  computed: courseGetters
}
</script>
