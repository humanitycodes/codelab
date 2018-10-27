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
    <h1>Unique Course Key</h1>
    <p class="warning">
      This is the unique key for the course that will appear in URLs and projects.
      <strong>It cannot be changed once the course is created.</strong>
    </p>
    <div class="key-field">
      <select
        v-model="prefix"
        id="course-prefix"
        name="course-prefix"
        aria-label="Department abbreviation"
      >
        <option
          v-for="prefixOption in prefixOptions"
          :key="prefixOption"
          :value="prefixOption"
        >
          {{ prefixOption }}
        </option>
      </select>
      <span>-</span>
      <input
        v-model="number"
        id="course-number"
        name="course-number"
        placeholder="Number"
        aria-label="Course number"
      >
      <span>-</span>
      <select
        v-model="semester"
        id="course-semester"
        name="course-semester"
        aria-label="Semester / Season"
      >
        <option
          v-for="(code, season) in semesterOptions"
          :key="code"
          :value="code"
        >
          {{ season }}
        </option>
      </select>
      <input
        v-model="year"
        id="course-year"
        name="course-year"
        placeholder="Year"
        aria-label="Course year (2 or 4 digits)"
      >
      <span>-</span>
      <input
        v-model="section"
        id="course-section"
        name="course-section"
        placeholder="Section"
        aria-label="Course section"
      >
    </div>
    <button
      :disabled="!keyIsValid || !this.courseKeyFormatted(this.courseQuery)"
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
import brand from '@env/brand'

export default {
  beforeRouteEnter (to, from, next) {
    if (to.path === '/courses/new/duplicate') {
      next(vm => {
        // access to component instance via `vm`
        vm.createDuplicate = true
      })
    } else {
      next()
    }
  },
  components: {
    Dropdown, Layout
  },
  data () {
    const prefixOptions = brand === 'msu' ? ['MI'] : ['LAB']
    const semesterOptions = {
      Spring: 'SS',
      Summer: 'US',
      Fall: 'FS'
    }
    return {
      prefixOptions,
      semesterOptions,
      prefix: prefixOptions[0],
      number: '',
      semester: semesterOptions.Spring,
      year: '',
      section: '',
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
        (
          queryRegex.test(course.courseKey)
        )
      ))
    },
    key () {
      return [
        this.prefix,
        this.number,
        this.semester + this.year.slice(this.year.length - 2),
        this.section
      ].join('-')
    },
    keyIsValid () {
      return (
        this.number.length === 3 &&
        (
          this.year.length === 2 ||
          this.year.length === 4
        ) &&
        this.section.length === 3
      )
    }
  },
  watch: {
    number (newNumber, oldNumber) {
      if (!/^\d{0,3}$/.test(newNumber)) {
        this.number = oldNumber
      }
    },
    year (newYear, oldYear) {
      if (!/^\d{0,4}$/.test(newYear)) {
        this.year = oldYear
      }
    },
    section (newSection, oldSection) {
      if (!/^\d{0,3}$/.test(newSection)) {
        this.section = oldSection
      }
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
