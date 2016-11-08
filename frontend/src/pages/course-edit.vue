<template>
  <Layout>
    <div v-if="currentCourse">
      <CourseForm :course="currentCourse"/>
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
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CourseForm
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
