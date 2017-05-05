<template>
  <Layout>
    <div v-if="currentCourse">
      <p v-if="!shouldUpdateCurrentCourse" class="error">
        It's not recommended to continue editing this course. If you want to use the same curriculum for a new semester, you should clone it.
      </p>
      <DoneButton fallback-route="/courses"/>
      <CourseForm :course="currentCourse"/>
      <DoneButton fallback-route="/courses"/>
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
      <p>Are you sure you want to permanently delete <strong>{{ currentCourse.title || currentCourse['.key'] }}</strong>?</p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
  </Layout>
</template>

<script>
import { mapActions } from 'vuex'
import Layout from '@layouts/main'
import CourseForm from '@components/course-form'
import DoneButton from '@components/done-button'
import ModalConfirm from '@components/modal-confirm'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CourseForm, DoneButton, ModalConfirm
  },
  data () {
    return {
      showModalConfirmRemoveCourse: false
    }
  },
  computed: courseGetters,
  methods: {
    ...mapActions(['destroyCourse']),
    showRemoveCourseModal () {
      this.showModalConfirmRemoveCourse = true
    },
    onCloseRemoveCourseModal (confirmed) {
      this.showModalConfirmRemoveCourse = false
      if (confirmed) {
        this.courses.remove(this.currentCourse['.key']).then(() => {
          window.location.replace('/courses')
        })
      }
    }
  }
}
</script>
