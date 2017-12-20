<template>
  <div v-if="!userPrivileges">
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-else>
    <div v-if="!userPrivileges.createPrivateRepo">
      <p class="warning">
        Projects cannot be started until you are able to create private repositories in GitHub.
        Apply for the <a href="https://education.github.com/pack" target="_blank">Student Developer Pack</a>
        and after your GitHub account has been upgrade, click the button below.
        <button class="warning block" @click="fetchPrivileges">
          Check Again
        </button>
      </p>
    </div>
    <div v-else-if="!allPrereqsComplete()">
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
      starting: false,
      userPrivileges: null
    }
  },
  created () {
    this.fetchPrivileges()
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
        this.error = `
          There was a problem creating the project repo on GitHub. Make sure
          you're connected to the Internet. If you've confirmed you are, tell
          your instructor about this and we'll work to resolve it as soon as
          possible.
        `
      })
    },
    fetchPrivileges () {
      this.userPrivileges = null
      Axios.get('/api/privileges')
      .then(response => {
        this.error = ''
        this.userPrivileges = response.data
      })
      .catch(() => {
        this.error = `
          There was a problem looking up your GitHub plan. Make sure you're
          connected to the Internet. If you've confirmed you are, tell your
          instructor about this and we'll work to resolve it as soon as
          possible.
        `
      })
    }
  }
}
</script>
