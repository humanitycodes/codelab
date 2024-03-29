<template>
  <div v-if="!userPrivileges">
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-else>
    <div v-if="!userPrivileges.createPrivateRepo">
      <p class="warning">
        <span v-if="brand === 'codelab517'">
          Projects cannot be started until you can create private
          repositories in GitHub. Please upgrade to the
          <a
            href="https://github.com/pricing"
            target="_blank"
          >Pro plan ($7/month)</a>
          and try starting the project again. You can cancel the plan after
          completing the course.
        </span>
        <span v-else>
          Projects cannot be started until you can create private
          repositories in GitHub. Apply for the
          <a
            href="https://education.github.com/pack"
            target="_blank"
          >Student Developer Pack</a>
          and after your GitHub account has been upgraded, try starting the
          project again.
        </span>
        <button class="warning block" @click="fetchPrivileges">
          Check Again
        </button>
      </p>
    </div>
    <div v-else-if="!allPrereqsComplete()">
      <p class="warning">
        This project cannot be started until all prerequisite lessons have been
        completed.
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
import store from '@state/store'
import areAllPrereqsComplete from '@helpers/computed/course-lesson-user-prereqs-are-all-complete'
import { userGetters } from '@state/helpers'
import createProjectCompletion from '@api/project-completions/create-project-completion'
import getUserPrivileges from '@api/users/get-user-privileges'
import brand from '@env/brand'

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
    projectCompletion: Object
  },
  data () {
    return {
      brand,
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
      return areAllPrereqsComplete(this.course, this.lesson, this.currentUser)
    },
    createProjectRepo () {
      this.starting = true
      createProjectCompletion({
        courseId: this.course.courseId,
        lessonId: this.lesson.lessonId
      })
      .then(projectCompletion => {
        this.error = ''
        store.dispatch('mergeProjectCompletions', [projectCompletion])
      })
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
      getUserPrivileges({ userId: this.currentUser.userId })
      .then(privileges => {
        this.error = ''
        this.userPrivileges = privileges
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.error = `
            There was a problem looking up your GitHub plan. Sign out and sign
            in before trying again. If you still can't start the project, tell
            your instructor about this and we'll work to resolve it as soon as
            possible.
          `
        } else {
          this.error = `
            There was a problem looking up your GitHub plan. Make sure you're
            connected to the Internet. If you've confirmed you are, tell your
            instructor about this and we'll work to resolve it as soon as
            possible.
          `
        }
      })
    }
  }
}
</script>
