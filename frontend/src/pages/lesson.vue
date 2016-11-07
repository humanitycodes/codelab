<template>
  <Layout>
    <div v-if="currentLesson">
      <EditCurrentLessonButton/>
      <pre>{{ currentLesson }}</pre>
      <EditCurrentLessonButton/>
    </div>
    <LessonNotFound v-else/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import LessonNotFound from '@components/lesson-not-found'
import { lessonGetters } from '@state/helpers'

export default {
  components: {
    Layout,
    LessonNotFound,
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
  computed: lessonGetters
}
</script>
