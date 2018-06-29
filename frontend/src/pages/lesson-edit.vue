<template>
  <Layout>
    <div v-if="currentLesson">
      <DoneButton fallback-route="/lessons"/>
      <LessonForm :lesson="currentLesson"/>
      <DoneButton fallback-route="/lessons"/>
      <button
        v-if="canDestroyCurrentLesson"
        @click="showRemoveLessonModal"
        class="danger block"
      >
        Delete lesson
      </button>
    </div>
    <LessonNotFound v-else/>
    <ModalConfirm
      :show="showModalConfirmRemoveLesson"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemoveLessonModal"
    >
      <p>
        Are you sure you want to permanently delete
        <strong>{{ currentLesson.title || currentLesson.lessonKey }}</strong>?
      </p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import LessonForm from '@components/lesson-form'
import LessonNotFound from '@components/lesson-not-found'
import DoneButton from '@components/done-button'
import ModalConfirm from '@components/modal-confirm'
import { lessonGetters } from '@state/helpers'
import deleteLesson from '@api/lessons/delete-lesson'
import store from '@state/store'

export default {
  components: {
    Layout, LessonForm, LessonNotFound, DoneButton, ModalConfirm
  },
  data () {
    return {
      showModalConfirmRemoveLesson: false
    }
  },
  computed: lessonGetters,
  methods: {
    showRemoveLessonModal () {
      this.showModalConfirmRemoveLesson = true
    },
    onCloseRemoveLessonModal (confirmed) {
      this.showModalConfirmRemoveLesson = false
      if (confirmed) {
        deleteLesson(this.currentLesson.lessonId)
        .then(() => store.dispatch('syncAllLessons'))
        .then(() => this.$router.replace('/lessons'))
      }
    }
  }
}
</script>
