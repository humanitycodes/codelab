<template>
  <div>
    <p v-if="error" class="danger">{{ error }}</p>
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
      .catch(() => {
        this.error = `There was a problem creating the project repo on GitHub. Make sure you're connected to the Internet. If you've confirmed you are, tell your instructor about this and we'll work to resolve it as soon as possible.`
      })
    }
  }
}
</script>
