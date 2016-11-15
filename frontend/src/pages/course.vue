<template>
  <Layout>
    <div v-if="currentCourse">
      <EditCurrentCourseButton/>
      <div class="form-row course-basic-data">
        <div class="form-group course-key">
          <span>{{ currentCourse['.key'] }}</span>
        </div>
        <div class="form-group course-credits">
          {{ currentCourse.credits }} credits
        </div>
      </div>
      <h2>{{ currentCourse.title }}</h2>
      <div class="form-row">
        <div class="form-group">
          <h3>Start date</h3>
          <div>{{ formattedStartDate }}</div>
        </div>
        <div class="form-group">
          <h3>End date</h3>
          <div>{{ formattedEndDate }}</div>
        </div>
      </div>
      <h3>Syllabus</h3>
      <div v-html="syllabusHTML"/>
      <EditCurrentCourseButton/>
    </div>
    <CourseNotFound v-else/>
  </Layout>
</template>

<script>
import { format as formatDate } from 'date-fns'
import Layout from '@layouts/main'
import CourseNotFound from '@components/course-not-found'
import { courseGetters } from '@state/helpers'
import rho from 'rho'

const dateFormat = 'MMMM Do, YYYY'

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
  computed: {
    ...courseGetters,
    formattedStartDate () {
      return formatDate(this.currentCourse.startDate, dateFormat)
    },
    formattedEndDate () {
      return formatDate(this.currentCourse.endDate, dateFormat)
    },
    syllabusHTML () {
      return rho.toHtml(this.currentCourse.syllabus)
    }
  }
}
</script>

<style lang="stylus" scoped>
.course-basic-data
  opacity: .8
  margin-bottom: 0
  font-family: 'Lato'

.course-credits
  text-align: right
</style>
