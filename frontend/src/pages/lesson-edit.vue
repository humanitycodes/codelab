<template>
  <Layout>
    <div v-if="currentLesson">
      <DoneButton fallback-route="/lessons"/>
      <LessonForm :lesson="currentLesson"/>
      <DoneButton fallback-route="/lessons"/>
      <button
        v-if="canDestroyCurrentLesson"
        @click="confirmDestroyLesson"
        class="danger block"
      >
        Delete lesson
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
import DoneButton from '@components/done-button'
import { lessonGetters } from '@state/helpers'

export default {
  components: {
    Layout, LessonForm, LessonNotFound, DoneButton
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
    ...mapActions(['destroyLesson'])
  }
}
</script>
