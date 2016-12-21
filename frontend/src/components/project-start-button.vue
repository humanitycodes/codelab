<template>
  <div v-if="hasNewGitHubScopes">
    You must reconnect your GitHub account before you can start this project.
  </div>
  <div v-else>
    <button
      v-if="!projectSubmission.repo"
      class="primary block"
      @click="startProject"
      :disabled="isInProgress"
    >
      <p v-if="isInProgress">
        Creating Project Repository
      </p>
      <p v-else>
        Create Project Repository
      </p>
    </button>
    <div v-else>
      <div>
        <strong>Congratulations!</strong> Your repository can be found at:
      </div>
      <a :href="projectSubmission.repo.htmlUrl" target="_blank">
        {{ projectSubmission.repo.htmlUrl }}
      </a>
    </div>
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'

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
    }
  },
  data () {
    return {
      isInProgress: false,
      projectSubmission: {}
    }
  },
  computed: userGetters,
  methods: {
    startProject () {
      this.isInProgress = true

      this.$http.post('project-submissions', {
        courseKey: this.course['.key'],
        lessonKey: this.lesson['.key'],
        projectKey: this.project['.key']
      })
      .then(response => response.json())
      .then(data => {
        this.projectSubmission = data
        this.isInProgress = false
      })
      .catch(response => {
        console.error('Failure!', response)
        this.isInProgress = false
      })
    }
  }
}
</script>
