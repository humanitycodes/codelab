<template>
  <Layout>
    <h1>Lessons</h1>
    <LessonsMap :lessons="lessons"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import LessonsMap from '@components/lessons-map'
import db from '@plugins/firebase'

export default {
  components: {
    Layout, LessonsMap
  },
  firebase: {
    lessons: db.ref('lessons')
  }
}
</script>
