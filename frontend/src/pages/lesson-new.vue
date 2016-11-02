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
        @click="createLesson"
        class="primary"
      >
        Create key
      </button>
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import { userHelpers } from '@state/helpers'
import db from '@plugins/firebase'
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    if (store.getters.userIsInstructor || store.getters.userIsAdmin) {
      next()
    } else {
      next('/')
    }
  },
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
  firebase: {
    lessons: db.ref('lessons')
  },
  computed: userHelpers,
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
    createLesson () {
      if (this.keyIsValid) {
        const key = [this.categoryPrefix, this.key].join('-')
        db.ref('lessons').child(key).set({
          createdBy: this.currentUser.uid
        })
        this.$router.replace(`/lessons/${key}/edit`)
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
