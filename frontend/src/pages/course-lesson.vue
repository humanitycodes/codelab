<template>
  <Layout>
    <EditCurrentLessonButton/>
    <div class="flex-row heading-basic-data">
      <div class="flex-col">
        <span>{{ currentCourse['.key'] }}</span>
      </div>
      <div class="flex-col">
        {{ gradePoints }} Grade Points
      </div>
    </div>
    <h2>{{ currentLesson.title }}</h2>
    <div class="flex-row">
      <div class="flex-col">
        <h3>Content</h3>
        <div v-html="lessonContentHTML" class="rendered-content"/>
      </div>
    </div>
    <EditCurrentLessonButton/>
  </Layout>
</template>

<script>
import rho from 'rho'
import Layout from '@layouts/main'
import {
  courseGetters, lessonGetters, courseLessonGetters
} from '@state/helpers'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'

export default {
  components: {
    Layout,
    EditCurrentLessonButton: {
      render (h) {
        if (!this.canUpdateCurrentLesson) return ''
        return (
          <router-link to={this.editCurrentLessonPath}>
            <button class='primary block'>
              Edit this lesson
            </button>
          </router-link>
        )
      },
      computed: lessonGetters
    }
  },
  computed: {
    ...courseGetters,
    ...lessonGetters,
    ...courseLessonGetters,
    lessonContentHTML () {
      return rho.toHtml(this.currentLesson.content)
    },
    gradePoints () {
      const realGradePoints = courseLessonGradePoints(this.currentCourse, this.currentLesson)
      return Math.floor(realGradePoints * 100) / 100
    }
  }
}
</script>
