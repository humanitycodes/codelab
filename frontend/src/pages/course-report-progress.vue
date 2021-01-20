<template>
  <Layout>
    <h1>Progress Report for {{ currentCourse.courseKey }}</h1>
    <CourseProgressReportTable :course="currentCourse"/>
  </Layout>
</template>

<script>
import store from '@state/store'
import { courseGetters } from '@state/helpers'
import Layout from '@layouts/main'
import CourseProgressReportTable from '@components/course-report-progress-table'

export default {
  beforeRouteEnter (to, from, next) {
    store.dispatch('syncResourceJournal').then(() => next())
  },
  components: {
    Layout, CourseProgressReportTable
  },
  computed: {
    ...courseGetters
  }
}
</script>
