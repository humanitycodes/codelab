<template>
  <Layout>
    <div v-if="course">
      <p v-if="!shouldUpdateCurrentCourse" class="error">
        It's not recommended to continue editing this course. If you want to use
        the same curriculum for a new semester, you should clone it.
      </p>
      <DoneButton @click="saveCourse"/>
      <CourseForm :course="course"/>
      <DoneButton @click="saveCourse"/>
      <button
        v-if="canDestroyCurrentCourse"
        @click="showRemoveCourseModal"
        class="danger block"
      >
        Delete
      </button>
    </div>
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
  </Layout>
</template>

<script>
import store from '@state/store'
import { courseGetters } from '@state/helpers'
import deepCopy from '@helpers/utils/deep-copy'
import Layout from '@layouts/main'
import CourseForm from '@components/course-form'
import DoneButton from '@components/done-button'
import ModalConfirm from '@components/modal-confirm'
import deleteCourse from '@api/courses/delete-course'
import updateCourse from '@api/courses/update-course'
import goBackOrFallback from '@helpers/utils/go-back-or-fallback'

export default {
  components: {
    Layout, CourseForm, DoneButton, ModalConfirm
  },
  data () {
    return {
      // Copy the current course so changes can be canceled
      course: deepCopy(store.getters.currentCourse),
      showModalConfirmRemoveCourse: false
    }
  },
  computed: courseGetters,
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
    saveCourse () {
      updateCourse(this.course)
      .then(updatedCourse => store.dispatch('mergeCourses', [updatedCourse]))
      .then(() => goBackOrFallback())
    }
  }
}
</script>
