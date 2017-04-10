<template>
  <div v-if="!allPrereqsComplete()">
    <p class="warning">
      This project cannot be started until all prerequisite lessons have been completed.
    </p>
  </div>
  <div v-else>
    <p v-if="error" class="error">{{ error }}</p>
    <button
      v-if="!projectCompletion"
      class="block"
      @click="createProjectRepo"
      :disabled="starting"
    >
      <span v-if="starting">
        Just a few seconds...
      </span>
      <span v-else>
        Start Project
      </span>
    </button>
  </div>
</template>

<script>
import prereqsAreAllComplete from '@helpers/computed/course-lesson-user-prereqs-are-all-complete'
import userGetters from '@state/helpers'
import Axios from 'axios'

export default {
  props: {
    course: {
      type: Object,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    projectCompletion: Object
  },
  data () {
    return {
      error: '',
      starting: false
    }
  },
  computed: userGetters,
  methods: {
    allPrereqsComplete () {
      return prereqsAreAllComplete(this.course, this.lesson, this.currentUser)
    },
    createProjectRepo () {
      this.starting = true
      Axios.post('/api/project-completions', {
        courseKey: this.course['.key'],
        lessonKey: this.lesson['.key'],
        projectKey: this.project['.key']
      })
      .then(() => { this.error = '' })
      .catch(() => {
        this.starting = false
        this.error = `There was a problem creating the project repo on GitHub. Make sure you're connected to the Internet. If you've confirmed you are, tell your instructor about this and we'll work to resolve it as soon as possible.`
      })
    }
  }
}
</script>
