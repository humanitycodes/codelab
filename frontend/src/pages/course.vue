<template>
  <Layout>
    <div v-if="currentCourse">
      <EditCurrentCourseButton/>
      <div class="flex-row heading-basic-data">
        <div class="flex-col">
          <span>{{ currentCourse['.key'] }}</span>
        </div>
        <div class="flex-col">
          {{ currentCourse.credits || '?' }} Credits
        </div>
      </div>
      <h1>{{ currentCourse.title }}</h1>
      <div class="flex-row">
        <div class="flex-col">
          <h3>Start date</h3>
          <div>{{ formattedStartDate }}</div>
        </div>
        <div class="flex-col">
          <h3>End date</h3>
          <div>{{ formattedEndDate }}</div>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-col">
          <h3>Syllabus</h3>
          <div
            v-if="syllabusHTML"
            v-html="syllabusHTML"
            class="rendered-content"
          />
          <p v-else>Not yet defined</p>
        </div>
      </div>
      <div class="flex-row" v-if="courseLessons.length">
        <div class="flex-col">
          <h3>Lessons</h3>
          <LessonsMap :course="currentCourse" :lessons="courseLessons"/>
        </div>
      </div>
      <EditCurrentCourseButton/>
    </div>
    <CourseNotFound v-else/>
  </Layout>
</template>

<script>
import formatDate from 'date-fns/format'
import Layout from '@layouts/main'
import CourseNotFound from '@components/course-not-found'
import LessonsMap from '@components/lessons-map'
import { courseGetters, lessonGetters } from '@state/helpers'
import rho from 'rho'

const dateFormat = 'MMMM Do, YYYY'

export default {
  components: {
    Layout,
    CourseNotFound,
    LessonsMap,
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
    ...lessonGetters,
    courseLessons () {
      return this.lessons.filter(lesson => {
        return this.currentCourse.lessonKeys.indexOf(lesson['.key']) !== -1
      })
    },
    formattedStartDate () {
      return this.humanizeDate(this.currentCourse.startDate)
    },
    formattedEndDate () {
      return this.humanizeDate(this.currentCourse.endDate)
    },
    syllabusHTML () {
      return rho.toHtml(this.currentCourse.syllabus)
    }
  },
  methods: {
    courseLessonPath (lesson) {
      return (
        '/courses/' + this.currentCourse['.key'] +
        '/lessons/' + lesson['.key']
      )
    },
    humanizeDate (date) {
      if (!date) return 'Not yet defined'
      return formatDate(date, dateFormat)
    }
  }
}
</script>
