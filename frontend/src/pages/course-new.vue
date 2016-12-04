<template>
  <Layout>
    <label>Unique Course Key</label>
    <p class="warning">This is the unique key for the course that will appear in URLs and project repos. <strong>It cannot be changed once the course is created.</strong></p>
    <div class="key-field">
      <select v-model="prefix">
        <option v-for="prefixOption in prefixOptions" :value="prefixOption">
          {{ prefixOption }}
        </option>
      </select>
      <span>-</span>
      <input v-model="number" placeholder="Number">
      <span>-</span>
      <select v-model="semester">
        <option v-for="(code, season) in semesterOptions" :value="code">
          {{ season }}
        </option>
      </select>
      <input v-model="year" placeholder="Year">
      <span>-</span>
      <input v-model="section" placeholder="Section">
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
          window.location = `/courses/${this.key}/edit`
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
