<template>
  <Layout>
    <div v-if="createDuplicate" class="mb-4">
      <h1 class="mb-4">Select Course To Duplicate</h1>
      <p class="danger" v-if="duplicateKeyInvalid">
        You have provided an invalid course key.
      </p>
      <Dropdown
        :results="queryResults"
        :resultHandler="addCourse"
        :resultContent="courseKey"
      >
        <input
          ref="queryInput"
          v-model="courseQuery"
          id="course-duplicate-query"
          name="course-duplicate-query"
          placeholder="Course Key"
        >
      </Dropdown>
    </div>
    <button
      :disabled="!createDuplicate ? !keyIsValid :
       !keyIsValid || !this.courseKeyFormatted(this.courseQuery)"
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
import { canReadCourse } from '@state/auth/courses'
import createCourse from '@api/courses/create-course'
import updateCourse from '@api/courses/update-course'
import Dropdown from '../components/dropdown'

export default {
  components: {
    Dropdown, Layout
  },
  data () {
    return {
      createDuplicate: false,
      courseQuery: '',
      duplicateKeyInvalid: false
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters,
    queryResults () {
      if (!this.courseQuery || this.courseKeyFormatted(this.courseQuery)) return []
      const queryRegex = new RegExp(this.courseQuery, 'i')
      return this.courses.filter(course => (
        canReadCourse({
          courseKey: course.courseKey
        }) &&
        // Course matches the query string
        (queryRegex.test(course.courseKey))
      ))
    }
  },
  methods: {
    courseKey (course) {
      return course.courseKey
    },
    courseKeyFormatted (key) {
      let pattern = new RegExp('[A-Z]{2,3}-[0-9]{3}-[A-Z]{2}[0-9]{2}-[0-9]{3}')
      return pattern.test(key)
    },
    tryToCreateCourse () {
      if (this.keyIsValid) {
        const courseKey = this.key
        if (!this.createDuplicate) {
          createCourse({
            courseKey,
            instructors: [{ userId: this.currentUser.userId }]
          })
          .then(newCourse => store.dispatch('mergeCourses', [newCourse]))
          .then(() => this.$router.replace(`/courses/${courseKey}/edit`))
        } else {
          // Check if course to duplicate exists
          if (!canReadCourse({ courseKey: this.courseQuery })) {
            this.duplicateKeyInvalid = true
            this.$refs.queryInput.focus()
          } else {
            this.duplicateKeyInvalid = false
            // Get course by key
            let duplicateCourse = this.courses.find(
              course => course.courseKey === this.courseQuery
            )
            createCourse({
              courseKey,
              instructors: [{ userId: this.currentUser.userId }]
            })
            .then(newCourse => updateCourse({
              ...newCourse,
              title: duplicateCourse.title || null,
              credits: duplicateCourse.credits || null,
              syllabus: duplicateCourse.syllabus || null,
              lessonIds: duplicateCourse.lessonIds || null
            }))
            .then(newCourse => store.dispatch('mergeCourses', [newCourse]))
            .then(() => this.$router.replace(`/courses/${courseKey}/edit`))
          }
        }
      }
    },
    addCourse (course) {
      this.courseQuery = course.courseKey
    }
  }
}
</script>

<style lang="stylus" scoped>
.key-field
  display: flex
  input
    flex-grow: 1
  > span
    line-height: 36px
    margin: 0 3px
  > button
    margin-left: 20px
</style>
