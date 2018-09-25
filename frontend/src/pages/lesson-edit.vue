<template>
  <Layout>
    <div v-if="lesson">
      <div class="flex mb-4 -mx-2">
        <div class="w-1/2 px-2">
          <DoneButton @click="saveLesson" :disabled="!dataChanged"
            :saveBtn="true"/>
        </div>
        <div class="w-1/2 px-2">
          <CancelButton @click="cancelEdit"/>
        </div>
      </div>
      <LessonForm :lesson="lesson"/>
      <div class="flex mb-4 -mx-2">
        <div class="w-1/2 px-2">
          <DoneButton @click="saveLesson" :disabled="!dataChanged"
            :saveBtn="true"/>
        </div>
        <div class="w-1/2 px-2">
          <CancelButton @click="cancelEdit"/>
        </div>
      </div>
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
      :show="showModalConfirmLeaveUnsaved.confirm"
      confirmClass="danger"
      confirmLabel="Leave"
      @close="onCloseUnsavedModal"
    >
      <p>
        The changes you made will be lost if you navigate away from
        this page without saving.
      </p>
      <p>
        Are you sure you want to leave this page?
      </p>
    </ModalConfirm>
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
import CancelButton from '@components/cancel-button'
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
  beforeRouteLeave (to, from, next) {
    // Check if changes have been made and make sure modal not open
    if (this.dataChanged &&
        this.showModalConfirmLeaveUnsaved.confirm === false &&
        !this.processingSave) {
      this.showModalConfirmLeaveUnsaved.routeTo = to
      this.showModalConfirmLeaveUnsaved.confirm = true
      next(false)
    } else {
      next()
    }
  },
  components: {
    Layout, LessonForm, LessonNotFound, DoneButton, CancelButton, ModalConfirm, ModalNotice
  },
  data () {
    return {
      // Copy the current lesson so changes can be canceled
      lesson: deepCopy(store.getters.currentLesson),
      showModalConfirmRemoveLesson: false,
      showModalLessonNoLongerExists: false,
      showModalConfirmLeaveUnsaved: {
        confirm: false,
        routeTo: null
      },
      processingSave: false
    }
  },
  computed: {
    ...lessonGetters,
    dataChanged () {
      // Detects changes between lesson objects to see if changed
      return (JSON.stringify(this.lesson) !==
       JSON.stringify(deepCopy(store.getters.currentLesson)))
    }
  },
  methods: {
    showRemoveLessonModal () {
      this.showModalConfirmRemoveLesson = true
    },
    onCloseUnsavedModal (confirmed) {
      if (confirmed) {
        this.$router.push(this.showModalConfirmLeaveUnsaved.routeTo)
      } else {
        this.showModalConfirmLeaveUnsaved.confirm = false
      }
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
      this.processingSave = true
      updateLesson(this.lesson)
      .then(updatedLesson => store.dispatch('mergeLessons', [updatedLesson]))
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.showModalLessonNoLongerExists = true
        }
        throw error
      })
      .then(() => goBackOrFallback())
    },
    cancelEdit () {
      this.$router.push('/lessons')
    }
  }
}
</script>
