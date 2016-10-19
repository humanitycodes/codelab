<template>
  <Layout>
    <h1>Lesson</h1>
    <p>{{ lesson }}</p>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import db from '@plugins/firebase'

export default {
  components: {
    Layout
  },
  firebase: {
    lessons: db.ref('lessons')
  },
  computed: {
    lesson () {
      return this.lessons.find(lesson => {
        return lesson['.key'] === this.$route.params.key
      })
    }
  }
}
</script>
