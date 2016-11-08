<template>
  <Layout>
    <h1>Courses</h1>
    <router-link to="/courses/new">New Course</router-link>
    <CoursesMap :courses="courses"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CoursesMap from '@components/courses-map'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CoursesMap
  },
  computed: courseGetters
}
</script>
