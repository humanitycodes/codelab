<template>
  <Layout>
    <div v-if="course">
      <p v-if="!shouldUpdateCurrentCourse" class="error">
        It's not recommended to continue editing this course. If you want to use
        the same curriculum for a new semester, you should clone it.
      </p>
      <div class="flex mb-4 -mx-2">
        <div class="w-1/2 px-2">
          <CancelButton @click="cancelEdit"/>
        </div>
        <div class="w-1/2 px-2">
          <DoneButton
            @click="saveCourse"
            :disabled="!dataChanged"
            :saveButton="true"
          />
        </div>
      </div>
      <CourseForm :course="course"/>
      <div class="flex mb-4 -mx-2">
        <div class="w-1/2 px-2">
          <CancelButton @click="cancelEdit"/>
        </div>
        <div class="w-1/2 px-2">
          <DoneButton
            @click="saveCourse"
            :disabled="!dataChanged"
            :saveButton="true"
          />
        </div>
      </div>
      <button
        v-if="canDestroyCurrentCourse"
        @click="showRemoveCourseModal"
        class="danger block"
      >
        Delete
      </button>
    </div>
    <ModalConfirm
      :show="showModalConfirmLeaveUnsaved.confirm"
      confirmClass="danger"
      confirmLabel="Leave"
      @close="onCloseUnsavedModal"
    >
      <p>
        The changes you made will be lost if you leave
        this page without saving.
      </p>
      <aside>
        Are you sure you want to leave this page?
      </aside>
    </ModalConfirm>
    <ModalConfirm
      :show="showModalConfirmRemoveCourse"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemoveCourseModal"
    >
      <p>
        Are you sure you want to permanently delete
        <strong>{{ course.title || course.courseKey }}</strong>?
      </p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
    <ModalNotice
      :show="showModalCourseNoLongerExists"
      @close="onCloseCourseNoLongerExistsModal"
    >
      <p>
        The course you are changing was removed. If you think this was a
        mistake, make a backup of your changes before navigating away from
        this page.
      </p>
    </ModalNotice>
  </Layout>
</template>

<script>
import store from '@state/store'
import { courseGetters } from '@state/helpers'
import deepCopy from '@helpers/utils/deep-copy'
import Layout from '@layouts/main'
import CourseForm from '@components/course-form'
import DoneButton from '@components/done-button'
import CancelButton from '@components/cancel-button'
import ModalConfirm from '@components/modal-confirm'
import ModalNotice from '@components/modal-notice'
import deleteCourse from '@api/courses/delete-course'
import updateCourse from '@api/courses/update-course'
import goBackOrFallback from '@helpers/utils/go-back-or-fallback'
import courseByKey from '@helpers/finders/course-by-key'

export default {
  beforeRouteEnter (to, from, next) {
    const course = courseByKey(to.params.courseKey)
    store.dispatch('syncCourse', course.courseId)
    .then(() => {
      if (!courseByKey(to.params.courseKey)) {
        next({ name: 'not-found', params: [to.path] })
      } else {
        next()
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    // Check if changes have been made and make sure modal not open
    if (
      this.dataChanged &&
      this.showModalConfirmLeaveUnsaved.confirm === false &&
      !this.processingSave
    ) {
      this.showModalConfirmLeaveUnsaved.routeTo = to
      this.showModalConfirmLeaveUnsaved.confirm = true
      next(false)
    } else {
      next()
    }
  },
  components: {
    Layout, CourseForm, DoneButton, CancelButton, ModalConfirm, ModalNotice
  },
  data () {
    return {
      // Copy the current course so changes can be canceled
      course: deepCopy(store.getters.currentCourse),
      showModalConfirmRemoveCourse: false,
      showModalCourseNoLongerExists: false,
      showModalConfirmLeaveUnsaved: {
        confirm: false,
        routeTo: null
      },
      processingSave: false
    }
  },
  computed: {
    ...courseGetters,
    dataChanged () {
      // Detects changes between course objects to see if changed
      const updatedCourseJson = JSON.stringify(this.course)
      const currentCourseJson = JSON.stringify(this.currentCourse)
      return updatedCourseJson !== currentCourseJson
    }
  },
  methods: {
    showRemoveCourseModal () {
      this.showModalConfirmRemoveCourse = true
    },
    onCloseRemoveCourseModal (confirmed) {
      this.showModalConfirmRemoveCourse = false
      if (confirmed) {
        deleteCourse(this.course.courseId)
        .then(() => store.dispatch('removeCourses', [this.course.courseId]))
        .then(() => this.$router.replace('/courses'))
      }
    },
    onCloseUnsavedModal (confirmed) {
      if (confirmed) {
        this.$router.replace(this.showModalConfirmLeaveUnsaved.routeTo)
      } else {
        this.showModalConfirmLeaveUnsaved.confirm = false
      }
    },
    onCloseCourseNoLongerExistsModal () {
      this.showModalCourseNoLongerExists = false
      store.dispatch('removeCourses', [this.course.courseId])
    },
    saveCourse () {
      this.processingSave = true
      updateCourse(this.course)
      .then(updatedCourse => store.dispatch('mergeCourses', [updatedCourse]))
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.showModalCourseNoLongerExists = true
        }
        throw error
      })
      .then(() => goBackOrFallback())
    },
    cancelEdit () {
      this.$router.replace('/courses')
    }
  }
}
</script>
