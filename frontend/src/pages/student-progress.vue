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
      return sortBy(this.availableCourses, [course => course['.key']])
    }
  },
  data () {
    return {
      availableCourses: []
    }
  },
  created () {
    const currentUserKey = store.state.users.currentUser.uid

    // Retrieve the large fields of the instructor's courses
    // so project completions are available
    this.courses.forEach(course => {
      if (course.instructorKeys.indexOf(currentUserKey) !== -1) {
        store.dispatch('syncLargeFieldsOfResource', {
          resourceName: 'courses',
          resourceKey: course['.key']
        })
        this.availableCourses.push(course)
      }
    })
  }
}
</script>
