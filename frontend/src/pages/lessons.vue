<template>
  <Layout>
    <h1>Lessons</h1>
    <router-link to="/lessons/new">New Lesson</router-link>
    <LessonsMap :lessons="lessons"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import LessonsMap from '@components/lessons-map'
import { lessonGetters } from '@state/helpers'

export default {
  components: {
    Layout, LessonsMap
  },
  computed: lessonGetters
}
</script>
