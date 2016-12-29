<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <button
      v-if="!projectCompletion"
      class="block"
      @click="createProjectRepo"
    >
      Start Project
    </button>
  </div>
</template>

<script>
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
      error: ''
    }
  },
  methods: {
    createProjectRepo () {
      Axios.post('/api/project-completions', {
        courseKey: this.course['.key'],
        lessonKey: this.lesson['.key'],
        projectKey: this.project['.key']
      })
      .then(() => { this.error = '' })
      .catch(error => {
        const { statusCode } = error.response.data
        if (statusCode === 404) {
          this.error = 'Are you connected to the Internet? Make sure you\'re connected and try again.'
          return
        }
        this.error = 'There was a problem creating the project repo on GitHub. Please tell your instructor about this and we\'ll work to resolve it as soon as possible.'
      })
    }
  }
}
</script>
