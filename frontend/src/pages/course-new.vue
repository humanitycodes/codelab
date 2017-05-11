<template>
  <Layout>
    <h1>Unique Course Key</h1>
    <p class="warning">This is the unique key for the course that will appear in URLs and project repos. <strong>It cannot be changed once the course is created.</strong></p>
    <div class="key-field">
      <label for="course-prefix" hidden>Department abbreviation</label>
      <select v-model="prefix" id="course-prefix" name="course-prefix" title="Department abbreviation">
        <option v-for="prefixOption in prefixOptions" :value="prefixOption">
          {{ prefixOption }}
        </option>
      </select>
      <span>-</span>
      <label for="course-number" hidden>Couse number</label>
      <input v-model="number" id="course-number" name="course-number" placeholder="Number" title="Course number">
      <span>-</span>
      <label for="course-semester" hidden>Semester / Season</label>
      <select v-model="semester" id="course-semester" name="course-semester" title="Semester/season">
        <option v-for="(code, season) in semesterOptions" :value="code">
          {{ season }}
        </option>
      </select>
      <label for="course-year" hidden>Course year</label>
      <input v-model="year" id="course-year" name="course-year" placeholder="Year" title="Course year (2 or 4 digits)">
      <span>-</span>
      <label for="course-section" hidden>Course section</label>
      <input v-model="section" id="course-section" name="course-section" placeholder="Section" title="Course section">
    </div>
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
import { userGetters, courseGetters } from '@state/helpers'

export default {
  components: {
    Layout
  },
  data () {
    const prefixOptions = ['MI']
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
      currentYear: new Date().getFullYear().toString().slice(2)
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters,
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
    tryToCreateCourse () {
      if (this.keyIsValid) {
        this.courses.add(this.key).then(() => {
          window.location.replace(`/courses/${this.key}/edit`)
        })
      }
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
