<template>
  <Layout>
    <CourseKeyForm @change-key-validity="keyIsValid = $event"
      @change-key="key = $event"
    />
    <button
      :disabled="!keyIsValid"
      @click="tryToCreateCourse"
      class="primary block"
    >
      Create instructor
    </button>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import store from '@state/store'
import { userGetters, courseGetters } from '@state/helpers'
import createCourse from '@api/courses/create-course'
import CourseKeyForm from '../components/course-form-key'

export default {
  components: {
    Layout, CourseKeyForm
  },
  data () {
    return {
      keyIsValid: false,
      key: ''
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters
  },
  methods: {
    tryToCreateCourse () {
      if (this.keyIsValid) {
        const courseKey = this.key
        createCourse({
          courseKey,
          instructors: [{ userId: this.currentUser.userId }]
        })
        .then(newCourse => store.dispatch('mergeCourses', [newCourse]))
        .then(() => this.$router.replace(`/courses/${courseKey}/edit`))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.key-field
  > button
    margin-left: 20px
</style>
