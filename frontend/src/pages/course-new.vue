<template>
  <Layout>
    <CourseKeyForm @changeKeyValidity="keyIsValid = $event"
      @changeKey="key = $event"
    />
    <button
      :disabled="!keyIsValid"
      @click="tryToCreateCourse"
      class="primary block"
    >
      Create key<span v-if="keyIsValid">: {{ key }}</span>
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
