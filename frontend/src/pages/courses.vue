<template>
  <Layout>
    <h1>Courses</h1>
    <router-link class="block" v-if="canCreateCourse()" to="/courses/new">New Course</router-link>
    <router-link v-if="canCreateCourse()" to="/courses/new/duplicate">Duplicate Course</router-link>
    <CoursesMap :courses="courses"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CoursesMap from '@components/courses-map'
import { courseGetters, coursePermissionMethods } from '@state/helpers'

export default {
  components: {
    Layout, CoursesMap
  },
  computed: courseGetters,
  methods: coursePermissionMethods
}
</script>
