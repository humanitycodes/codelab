<template>
  <Layout>
    <h1>Student Progress</h1>
    <CourseProgress
      v-for="course in coursesSortedByKey"
      :course="course"
      :key="course.courseId"
    />
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CourseProgress from '@components/course-progress'
import { courseGetters, userGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    Layout, CourseProgress
  },
  computed: {
    ...courseGetters,
    ...userGetters,
    availableCourses () {
      const currentUserId = this.currentUser.userId
      return this.courses.filter(
        course => course.instructorIds.includes(currentUserId)
      )
    },
    coursesSortedByKey () {
      return sortBy(this.availableCourses, [course => course.courseKey])
    }
  }
}
</script>
