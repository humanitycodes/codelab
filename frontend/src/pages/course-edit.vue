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
        @click="confirmDestroyCourse"
        class="danger block"
      >
        Delete
      </button>
    </div>
  </Layout>
</template>

<script>
import { mapActions } from 'vuex'
import Layout from '@layouts/main'
import CourseForm from '@components/course-form'
import DoneButton from '@components/done-button'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CourseForm, DoneButton
  },
  computed: courseGetters,
  methods: {
    confirmDestroyCourse () {
      const srsly = confirm('Are you sure you want to PERMANENTLY delete this course?')
      if (srsly) {
        this.destroyCourse(this.currentCourse).then(() => {
          this.$router.push('/courses')
        })
      }
    },
    ...mapActions(['destroyCourse'])
  }
}
</script>
