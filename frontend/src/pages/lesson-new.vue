<template>
  <Layout>
    <label>Unique Lesson Key</label>
    <p class="warning">This is the unique key for the lesson that will appear in URLs and project repos. <strong>It cannot be changed once the lesson is created.</strong></p>
    <div class="key-field">
      <select v-model="categoryPrefix">
        <option v-for="category in lessonCategories">
          {{ category }}
        </option>
      </select>
      <span>-</span>
      <input v-model="key">
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
import { mapActions } from 'vuex'
import Layout from '@layouts/main'
import { userGetters, lessonGetters } from '@state/helpers'

export default {
  components: {
    Layout
  },
  data () {
    const lessonCategories = [
      'html', 'css', 'js'
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
      if (/(?:[^a-z\-]|--)/.test(this.key)) {
        this.key = oldKey
      }
      this.validateKey(this.key)
    }
  },
  methods: {
    validateKey () {
      const validRegex = /^[a-z]+(?:-[a-z]+)*$/
      const keyFormatIsValid = validRegex.test(this.key)
      const keyIsUnique = this.lessons.every(lesson => {
        return lesson.key !== this.key
      })
      this.keyIsValid = keyFormatIsValid && keyIsUnique
    },
    tryToCreateLesson () {
      if (this.keyIsValid) {
        const key = [this.categoryPrefix, this.key].join('-')
        this.createLesson(key).then(() => {
          this.$router.replace(`/lessons/${key}/edit`)
        })
      }
    },
    ...mapActions(['createLesson'])
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
