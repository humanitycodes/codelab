<template>
  <div>
    <button
      v-if="!projectCompletion"
      class="block"
      @click="createProjectRepo"
    >
      Start Project
    </button>

    <div v-else>
      <div class="flex-row project-submission-tabs">
        <button
          class="flex-col success"
          :disabled="!shouldShowStart"
        >
          Started
        </button>
        <button
          class="flex-col"
          :disabled="!shouldShowSubmit"
        >
          <span v-if="!projectCompletion.submission">Submit</span>
          <span v-else>Submitted</span>
        </button>
        <button
          class="flex-col"
          :disabled="!shouldShowFeedback"
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
      <div v-if="shouldShowStart" class="project-submission-instructions">
        <div class="repo-link">
          <a :href="projectRepoUrl" target="_blank">
            GitHub Repository
          </a>
        </div>
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
          Add all the files you worked on to the list of changes you want to commit:
          <CodeBlock>
            git add -A .
          </CodeBlock>
        </p>
        <p>
          Commit the list of changes to <em>your</em> computer:
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
        <button
          class="primary block"
          @click="transitionToSubmit"
          name="ready-to-submit"
        >
          I'm Done
        </button>
      </div>
      <div v-else-if="shouldShowSubmit" class="project-submission-instructions">
        <template v-if="project.hosting">
          <h4>
            Put your project on the web:
          </h4>
          <template v-if="project.hosting === 'GitHub Pages'">
            <p>
              Upload your code to GitHub Pages:
              <CodeBlock>
                git push -f origin master:gh-pages
              </CodeBlock>
            </p>
            <p>
              When you're done, your project can be viewed at:
              <br/>
              <div class="repo-link">
                <a :href="githubPagesUrl" target="_blank">
                  {{ githubPagesUrl }}
                </a>
              </div>
            </p>
          </template>
          <template v-else-if="project.hosting === 'Heroku'">
            <p>
              Deploy your code to Heroku:
              <CodeBlock>
                git push heroku master
              </CodeBlock>
            </p>
          </template>
        </template>

        <h4>
          Review project criteria:
        </h4>
        <p>
          Before submitting your project, please make sure you have met the
          following criteria:
          <ol>
            <li v-for="criterion in project.criteria">
              {{ criterion.content }}
            </li>
          </ol>
        </p>
        <button
          class="primary block"
          @click="startProjectSubmission"
          name="start-submit"
        >
          Submit
        </button>
      </div>
      <div v-else-if="shouldShowFeedback" class="project-submission-instructions">
        Feedback Placeholder
      </div>
    </div>
    <p v-if="error" class="danger">{{ error }}</p>
  </div>
</template>

<script>
import Axios from 'axios'
import querystring from 'querystring'
import { userGetters } from '@state/helpers'
import CodeBlock from '@components/code-block'

function repoName (course, lesson, project) {
  return [
    course['.key'],
    lesson['.key'],
    project['.key'].slice(-6)
  ].join('-')
}

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
    return {
      readyToSubmit: false,
      error: null
    }
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
        repoName(this.course, this.lesson, this.project)
      ].join('')
    },
    githubPagesUrl () {
      return [
        'https://',
        this.currentUser.profile.github.login,
        '.github.io/',
        repoName(this.course, this.lesson, this.project)
      ].join('')
    },
    hostedUrl () {
      if (this.project.hosting === 'GitHub Pages') {
        return this.githubPagesUrl
      } else if (this.project.hosting === 'Heroku') {
        return 'https://heroku.com'
      }
    },
    shouldShowStart () {
      return !this.projectCompletion || (
        !this.projectCompletion.submission &&
        !this.readyToSubmit
      )
    },
    shouldShowSubmit () {
      return this.projectCompletion && this.readyToSubmit
    },
    shouldShowFeedback () {
      return this.projectCompletion &&
        this.projectCompletion.submission &&
        !this.projectCompletion.submission.isApproved
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
    },
    startProjectSubmission () {
      const criteria = this.project.criteria.map(criterion => criterion.content)

      const newIssueUrl = [
        'https://github.com/',
        this.currentUser.profile.github.login,
        '/',
        repoName(this.course, this.lesson, this.project),
        '/issues/new?',
        querystring.stringify({
          title: 'Project Feedback',
          body: `Can you take a look at this? It's [hosted here](${this.projectRepoUrl}) and meets the following criteria:\n\n- [x] ${criteria.join('\n- [x] ')}\n\nAdd your own notes below this line.`
        })
      ].join('')

      window.open(newIssueUrl, '_blank').focus()
    },
    transitionToSubmit () {
      this.error = ''
      this.readyToSubmit = true
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
.repo-link
  width: 100%
  text-align: center
</style>
