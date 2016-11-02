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
import db from '@plugins/firebase'
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    if (store.getters.userAtLeastInstructor) {
      next()
    } else {
      next('/')
    }
  },
  components: {
    Layout, LessonsMap
  },
  firebase: {
    lessons: db.ref('lessons')
  }
}
</script>
