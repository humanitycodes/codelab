<template>
  <Layout>
    <div v-if="currentLesson">
      <LessonForm :lesson="currentLesson"/>
      <button
        v-if="canDestroyLesson(currentLesson['.key'])"
        @click="confirmDestroyLesson"
        class="danger"
      >
        Delete
      </button>
    </div>
    <LessonNotFound v-else/>
  </Layout>
</template>

<script>
import { mapActions } from 'vuex'
import Layout from '@layouts/main'
import LessonForm from '@components/lesson-form'
import LessonNotFound from '@components/lesson-not-found'
import { lessonGetters, lessonPermissionMethods } from '@state/helpers'

export default {
  components: {
    Layout, LessonForm, LessonNotFound
  },
  computed: lessonGetters,
  methods: {
    confirmDestroyLesson () {
      const srsly = confirm('Are you sure you want to PERMANENTLY delete this lesson?')
      if (srsly) {
        this.destroyLesson(this.currentLesson).then(() => {
          this.$router.push('/lessons')
        })
      }
    },
    ...mapActions(['destroyLesson']),
    ...lessonPermissionMethods
  }
}
</script>
