<template>
  <Layout>
    <pre v-if="currentLesson">{{ currentLesson }}</pre>
    <LessonNotFound v-else/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import LessonNotFound from '@components/lesson-not-found'
import { lessonGetters } from '@state/helpers'

export default {
  components: {
    Layout, LessonNotFound
  },
  computed: lessonGetters
}
</script>
