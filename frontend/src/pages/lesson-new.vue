<template>
  <Layout>
    <h1>Unique Lesson Key</h1>
    <p class="warning">
      This is the unique key for the lesson that will appear in URLs and projects.
      <strong>It cannot be changed once the lesson is created.</strong>
    </p>
    <div class="key-field">
      <select
        v-model="categoryPrefix"
        id="lesson-category"
        name="lesson-category"
        aria-label="Lesson category"
      >
        <option
          v-for="category in lessonCategories"
          :key="category"
        >
          {{ category }}
        </option>
      </select>
      <span>-</span>
      <input
        v-model="key"
        id="lesson-key"
        name="lesson-key"
        placeholder="Lesson key (e.g. jquery-intro)"
        aria-label="Lesson key"
      >
      <button
        :disabled="!keyIsValid"
        @click="tryToCreateLesson"
        class="primary"
      >
        Create key
      </button>
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import { userGetters, lessonGetters } from '@state/helpers'
import store from '@state/store'
import createLesson from '@api/lessons/create-lesson'

export default {
  components: {
    Layout
  },
  data () {
    const lessonCategories = [
      'html', 'css', 'js', 'sql'
    ]
    return {
      key: '',
      keyIsValid: false,
      lesson: null,
      lessonCategories,
      categoryPrefix: lessonCategories[0]
    }
  },
  computed: {
    ...userGetters,
    ...lessonGetters
  },
  watch: {
    key (newKey, oldKey) {
      this.key = this.key.toLowerCase()
      if (/(?:[^a-z-]|--)/.test(this.key)) {
        this.key = oldKey
      }
      this.validateKey(this.key)
    }
  },
  methods: {
    validateKey () {
      const validRegex = /^[a-z]+(?:-[a-z]+)*$/
      const keyFormatIsValid = validRegex.test(this.key)
      const keyIsUnique = this.lessons.every(lesson => lesson.key !== this.key)
      this.keyIsValid = keyFormatIsValid && keyIsUnique
    },
    tryToCreateLesson () {
      if (this.keyIsValid) {
        const lessonKey = `${this.categoryPrefix}-${this.key}`
        createLesson({ lessonKey })
        .then(newLesson => store.dispatch('mergeLessons', [newLesson]))
        .then(() => this.$router.replace(`/lessons/${lessonKey}/edit`))
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
