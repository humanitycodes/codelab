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
    <ModalNotice
      :show="showModalLessonNoLongerExists"
      @close="onCloseLessonNoLongerExistsModal"
    >
      <p>
        The lesson you are changing could not be found. If you think this is a
        mistake, backup your changes before navigating away from this page and
        contact another instructor or administrator.
      </p>
    </ModalNotice>
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
import ModalNotice from '@components/modal-notice'
import deleteLesson from '@api/lessons/delete-lesson'
import updateLesson from '@api/lessons/update-lesson'
import goBackOrFallback from '@helpers/utils/go-back-or-fallback'
import lessonByKey from '@helpers/finders/lesson-by-key'

export default {
  beforeRouteEnter (to, from, next) {
    const lesson = lessonByKey(to.params.lessonKey)
    store.dispatch('syncLesson', lesson.lessonId)
    .then(() => {
      if (!lessonByKey(to.params.lessonKey)) {
        next({ name: 'not-found', params: [to.path] })
      } else {
        next()
      }
    })
  },
  components: {
    Layout, LessonForm, LessonNotFound, DoneButton, ModalConfirm, ModalNotice
  },
  data () {
    return {
      // Copy the current lesson so changes can be canceled
      lesson: deepCopy(store.getters.currentLesson),
      showModalConfirmRemoveLesson: false,
      showModalLessonNoLongerExists: false
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
    onCloseLessonNoLongerExistsModal () {
      this.showModalLessonNoLongerExists = false
      store.dispatch('removeLessons', [this.lesson.lessonId])
    },
    saveLesson () {
      updateLesson(this.lesson)
      .then(updatedLesson => store.dispatch('mergeLessons', [updatedLesson]))
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.showModalLessonNoLongerExists = true
        }
        throw error
      })
      .then(() => goBackOrFallback())
    }
  }
}
</script>
