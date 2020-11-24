<template>
  <Layout>
    <div class="mb-4">
      <h1 class="mb-4">Select Course To Copy</h1>
      <p class="danger" v-if="duplicateKeyInvalid">
        This course key is invalid.
        <span class="block">Could not find a course for the requested course key.</span>
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
    <CourseKeyForm @changeKeyValidity="keyIsValid = $event"
      @changeKey="key = $event"
    />
    <button
      :disabled="!keyAndCourseFormatted"
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
import CourseKeyForm from '../components/course-form-key'
import courseByKey from '@helpers/finders/course-by-key'

export default {
  components: {
    Dropdown, Layout, CourseKeyForm
  },
  data () {
    return {
      courseQuery: '',
      keyIsValid: false,
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
    },
    keyAndCourseFormatted () {
      return (
        this.keyIsValid && this.courseKeyFormatted(this.courseQuery)
      )
    }
  },
  methods: {
    courseKey (course) {
      return course.courseKey
    },
    courseKeyFormatted (key) {
      const pattern = /[A-Z]{2,3}-[0-9]{3}-[A-Z]{2}[0-9]{2}-[0-9]{3}/
      return pattern.test(key)
    },
    tryToCreateCourse () {
      if (this.keyIsValid) {
        const courseKey = this.key
        // Check if course to duplicate exists
        if (!canReadCourse({ courseKey: this.courseQuery })) {
          this.duplicateKeyInvalid = true
          this.$refs.queryInput.focus()
        } else {
          this.duplicateKeyInvalid = false
          // Get course by key
          let duplicateCourse = courseByKey(this.courseQuery)
          store.dispatch('syncCourse', duplicateCourse.courseId).then(() => {
            duplicateCourse = (courseByKey(this.courseQuery))
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
          })
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
