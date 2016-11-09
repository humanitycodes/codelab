<template>
  <Layout>
    <div v-if="currentCourse">
      <EditCurrentCourseButton/>
      <pre>{{ currentCourse }}</pre>
      <EditCurrentCourseButton/>
    </div>
    <CourseNotFound v-else/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CourseNotFound from '@components/course-not-found'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout,
    CourseNotFound,
    EditCurrentCourseButton: {
      render (h) {
        if (!this.canUpdateCurrentCourse) return ''
        return (
          <router-link to={this.editCurrentCoursePath}>
            <button class='primary block'>
              Edit this course
            </button>
          </router-link>
        )
      },
      computed: courseGetters
    }
  },
  computed: courseGetters
}
</script>
