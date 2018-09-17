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
import { lessonGetters } from '@state/helpers'
import deepCopy from '@helpers/utils/deep-copy'
import Layout from '@layouts/main'
import LessonForm from '@components/lesson-form'
import LessonNotFound from '@components/lesson-not-found'
import DoneButton from '@components/done-button'
import ModalConfirm from '@components/modal-confirm'
import deleteLesson from '@api/lessons/delete-lesson'
import updateLesson from '@api/lessons/update-lesson'
import goBackOrFallback from '@helpers/utils/go-back-or-fallback'
import lessonByKey from '@helpers/finders/lesson-by-key'

export default {
  beforeRouteEnter (to, from, next) {
    const lesson = lessonByKey(to.params.lessonKey)
    store.dispatch('syncLesson', lesson.lessonId).then(() => next())
  },
  components: {
    Layout, LessonForm, LessonNotFound, DoneButton, ModalConfirm
  },
  data () {
    return {
      // Copy the current lesson so changes can be canceled
      lesson: deepCopy(store.getters.currentLesson),
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
        .then(() => store.dispatch('removeLessons', [this.lesson.lessonId]))
        .then(() => this.$router.replace('/lessons'))
      }
    },
    saveLesson () {
      updateLesson(this.lesson)
      .then(updatedLesson => store.dispatch('mergeLessons', [updatedLesson]))
      .then(() => goBackOrFallback())
    }
  }
}
</script>
