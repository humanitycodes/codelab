<template>
  <Layout>
    <div v-if="currentLesson">
      <DoneButton/>
      <LessonForm :lesson="currentLesson"/>
      <DoneButton/>
      <button
        v-if="canDestroyLesson(currentLesson['.key'])"
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
import { lessonGetters, lessonPermissionMethods } from '@state/helpers'

export default {
  components: {
    Layout,
    LessonForm,
    LessonNotFound,
    DoneButton: {
      render (h) {
        const getOuttaHere = () => {
          window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push('/lessons')
        }
        return (
          <button class="primary block" on-click={getOuttaHere}>
            My work here is done
          </button>
        )
      }
    }
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
