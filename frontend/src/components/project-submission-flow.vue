<template>
  <div>
    <button
      v-if="!projectCompletion"
      class="block"
      @click="createProjectRepo"
    >
      Start Project
    </button>
    <div
      v-else
      class="flex-row project-submission-tabs"
    >
      <button
        class="flex-col success"
        disabled
      >
        Started
      </button>
      <button
        class="flex-col"
        :disabled="projectCompletion.submission"
      >
        <span v-if="!projectCompletion.submission">Submit</span>
        <span v-else>Submitted</span>
      </button>
      <button
        class="flex-col"
        :disabled="
          !projectCompletion.submission ||
          projectCompletion.submission.isApproved
        "
      >
        <span v-if="
          projectCompletion.submission &&
          !projectCompletion.submission.instructorCommentedLast &&
          !projectCompletion.submission.isApproved
        ">
          Awaiting Feedback
        </span>
        <span v-else-if="
          projectCompletion.submission &&
          projectCompletion.submission.instructorCommentedLast &&
          !projectCompletion.submission.isApproved
        ">
          Respond to Feedback
        </span>
        <span v-else-if="
          projectCompletion.submission &&
          projectCompletion.submission.isApproved
        ">
          Project Approved
        </span>
        <span v-else>Get Feedback</span>
      </button>
    </div>
    <div v-if="projectCompletion" class="project-submission-instructions">
      <a :href="projectRepoUrl" target="_blank">
        GitHub Repository
      </a>
      <h4>
        Before you start coding:
      </h4>
      <p>
        Add the repository to your computer:
        <CodeBlock>
          git clone {{ projectRepoUrl }}.git
        </CodeBlock>
      </p>
      <h4>
        When you're done coding:
      </h4>
      <p>
        Add the files you worked on to the list of changes you want to commit:
        <CodeBlock>
          git add -A .
        </CodeBlock>
      </p>
      <p>
        Commit your list of changes to <em>your</em> computer:
        <CodeBlock>
          git commit -m 'a short message describing your changes'
        </CodeBlock>
      </p>
      <p>
        Upload your commits to your GitHub repository:
        <CodeBlock>
          git push origin master
        </CodeBlock>
      </p>
    </div>
    <p v-if="error" class="danger">{{ error }}</p>
  </div>
</template>

<script>
import Axios from 'axios'
import { userGetters } from '@state/helpers'
import CodeBlock from '@components/code-block'

export default {
  components: {
    CodeBlock
  },
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
    return { error: null }
  },
  computed: {
    ...userGetters,
    projectCompletion () {
      const rawProjectCompletion = this.course.projectCompletions.find(completion => {
        return completion['.key'] === [this.project['.key'], this.currentUser.uid].join('-')
      })
      if (rawProjectCompletion) {
        const projectCompletion = { ...rawProjectCompletion }
        projectCompletion.studentKey = projectCompletion.students[0]['.key']
        delete projectCompletion.students
        return projectCompletion
      }
    },
    projectRepoUrl () {
      return [
        'https://github.com/',
        this.currentUser.profile.github.login,
        '/',
        [
          this.course['.key'],
          this.lesson['.key'],
          this.project['.key'].slice(-6)
        ].join('-')
      ].join('')
    }
  },
  methods: {
    createProjectRepo () {
      Axios.post('/api/project-completions', {
        courseKey: this.course['.key'],
        lessonKey: this.lesson['.key'],
        projectKey: this.project['.key']
      })
      .then(() => {
        this.error = ''
      })
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

<style lang="stylus" scoped>
@import '../meta'

.project-submission-tabs
  margin-bottom: 0
  > button
    border-radius: 6px
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    margin: 0
    margin-right: -1px
    &:not([disabled])
      border-bottom: none
.project-submission-instructions
  border: 1px solid $design.control.border.color
  border-top: none
  padding: $design.layout.gutterWidth
  :first-child
    margin-top: 0
  :last-child
    margin-bottom: 0
</style>
