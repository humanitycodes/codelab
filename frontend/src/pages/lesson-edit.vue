<template>
  <Layout>
    <div v-if="lesson.createdBy">
      <LessonForm :lesson="lesson"/>
      <button @click="removeLesson" class="danger">
        Delete
      </button>
    </div>
    <div v-if="!lesson.createdBy && lesson['.key']">
      The lesson <strong>{{ $route.params.key }}</strong> doesn't exist. Did you mean
      <router-link
        :to="'/lessons/' + suggestedKey + '/edit'"
      >{{ suggestedKey }}</router-link>?
    </div>
  </Layout>
</template>

<script>
import db from '@plugins/firebase'
import Layout from '@layouts/main'
import LessonForm from '@components/lesson-form'
import suggestedKey from '@helpers/suggested-lesson-key'

export default {
  components: {
    Layout, LessonForm
  },
  firebase () {
    const key = this.$route.params.key
    return {
      lesson: {
        source: db.ref('lessons').child(key),
        asObject: true
      },
      lessons: db.ref('lessons')
    }
  },
  computed: {
    suggestedKey
  },
  methods: {
    removeLesson () {
      const srsly = confirm('Are you sure you want to PERMANENTLY delete this lesson?')
      if (srsly) {
        this.$firebaseRefs.lesson.remove()
        this.$router.push('/lessons')
      }
    }
  }
}
</script>
