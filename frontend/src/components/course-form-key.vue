<template>
  <div>
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
  </div>
</template>

<script>
import brand from '@env/brand'

export default {
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
      section: ''
    }
  },
  computed: {
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
    },
    keyIsValid (keyValidity) {
      this.$emit('changeKeyValidity', keyValidity)
      this.$emit('changeKey', this.key)
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
</style>
