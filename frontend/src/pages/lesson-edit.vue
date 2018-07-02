<template>
  <Layout>
    <div v-if="lesson">
      <DoneButton @click="saveLesson"/>
      <LessonForm :lesson="lesson"/>
      <DoneButton @click="saveLesson"/>
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
        <strong>{{ lesson.title || lesson.lessonKey }}</strong>?
      </p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/main'
import LessonForm from '@components/lesson-form'
import LessonNotFound from '@components/lesson-not-found'
import DoneButton from '@components/done-button'
import ModalConfirm from '@components/modal-confirm'
import { lessonGetters } from '@state/helpers'
import deleteLesson from '@api/lessons/delete-lesson'
import updateLesson from '@api/lessons/update-lesson'
import goBackOrFallback from '@helpers/utils/go-back-or-fallback'

export default {
  components: {
    Layout, LessonForm, LessonNotFound, DoneButton, ModalConfirm
  },
  data () {
    return {
      // Copy the current lesson so changes can be canceled
      lesson: JSON.parse(JSON.stringify(store.getters.currentLesson)),
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
        deleteLesson(this.lesson.lessonId)
        .then(() => store.dispatch('syncAllLessons'))
        .then(() => this.$router.replace('/lessons'))
      }
    },
    saveLesson () {
      updateLesson(this.lesson)
      .then(() => store.dispatch('syncAllLessons'))
      .then(() => goBackOrFallback())
    }
  }
}
</script>
