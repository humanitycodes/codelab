<template>
  <Layout>
    <h1>Student Progress</h1>
    <CourseProgress v-for="course in coursesSortedByKey" :course="course"/>
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
    coursesSortedByKey () {
      return sortBy(this.courses, [course => course['.key']])
    }
  },
  created () {
    // Retrieve the large fields so projectCompletions are available
    this.courses.forEach(course => {
      store.dispatch('syncLargeFieldsOfResource', {
        resourceName: 'courses',
        resourceKey: course['.key']
      })
    })
  }
}
</script>
