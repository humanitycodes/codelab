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
import courseByKey from '@helpers/finders/course-by-key'

export default {
  beforeRouteEnter (to, from, next) {
    const course = courseByKey(to.params.courseKey)
    store.dispatch('syncCourse', course.courseId)
    .then(() => {
      if (!courseByKey(to.params.courseKey)) {
        next({ name: 'not-found', params: [to.path] })
      } else {
        next()
      }
    })
  },
  components: {
    Layout, CourseProgressReportTable
  },
  computed: {
    ...courseGetters
  }
}
</script>
