<template>
  <div>
    <ProjectCompletionLinks :repo-url="projectRepoUrl"/>

    <p v-if="error" class="error">{{ error }}</p>

    <ProjectCompletionUpdateInstructions
      :lesson="lesson"
      :projectName="projectName"
      :projectRepoUrl="projectRepoUrl"
      :projectHostedUrl="projectHostedUrl"
      :projectHostedSubdomain="projectHostedSubdomain"
    />

    <template v-if="instructors.length > 1">
      <h4>Choose a reviewer</h4>
      <select
        v-model="chosenInstructor"
        aria-label="Choose a reviewer"
      >
        <option
          v-for="instructor in instructors"
          :key="instructor.userId"
          :value="instructor.githubLogin"
        >{{ instructor.fullName }}</option>
      </select>
    </template>

    <h4>Submit for review</h4>
    <p>
      Final step! But first, make sure you've met the following criteria
      (check each box to confirm):
    </p>
    <label
      v-for="criterion in sortedProjectCriteria"
      :key="criterion.lessonProjectCriterionId"
      class="with-inline-input"
    >
      <input
        type="checkbox"
        v-model="metCriteria[criterion.lessonProjectCriterionId]"
      >
      <span v-html="convertRichContentToInlineHtml(criterion.content)"/>
    </label>

    <button
      class="primary block"
      @click="submitForReview"
      :disabled="!allCriteriaMet"
    >
      Submit project for review
    </button>
  </div>
</template>

<script>
import QueryString from 'querystring'
import { userGetters } from '@state/helpers'
import ProjectCompletionUpdateInstructions from './project-completion-update-instructions'
import ProjectCompletionLinks from './project-completion-links'
import convertRichContentToInlineHtml from '@helpers/utils/convert-rich-content-to-inline-html'
import userById from '@helpers/finders/user-by-id'
import randomElement from '@helpers/utils/random-element'
import sortByPosition from '@helpers/utils/sort-by-position'

export default {
  components: {
    ProjectCompletionLinks, ProjectCompletionUpdateInstructions
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
    projectCompletion: {
      type: Object,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    projectRepoUrl: {
      type: String,
      required: true
    },
    projectHostedUrl: {
      type: String,
      required: true
    },
    projectHostedSubdomain: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      metCriteria: this.lesson.projectCriteria
        .map(criterion => ({ [criterion.lessonProjectCriterionId]: false }))
        .reduce((a, b) => Object.assign({}, a, b)),
      error: '',
      instructors: this.course.instructorIds
        .map(instructorId => userById(instructorId))
        .filter(instructor => !!instructor.githubLogin),
      chosenInstructor: null
    }
  },
  created () {
    if (this.instructors.length) {
      this.chosenInstructor = randomElement(this.instructors).githubLogin
    } else {
      this.error = `
        Your instructor has not connected their GitHub account. Please tell your
        instructor about this so you can submit your project.
      `
    }
  },
  computed: {
    ...userGetters,
    allCriteriaMet () {
      return this.chosenInstructor &&
        Object.keys(this.metCriteria).every(id => this.metCriteria[id])
    },
    sortedProjectCriteria () {
      return sortByPosition(this.lesson.projectCriteria)
    }
  },
  methods: {
    convertRichContentToInlineHtml,
    submitForReview () {
      const criteria = this.sortedProjectCriteria.map(
        criterion => criterion.content
      )

      const newIssueUrl = [
        'https://github.com/',
        this.currentUser.githubLogin,
        '/',
        this.projectName,
        '/issues/new?',
        QueryString.stringify({
          title: 'Project Feedback',
          body:
            `## ${this.lesson.projectTitle}\n\n@${this.chosenInstructor} ` +
            'Can you take a look at this? ' +
            `It's [hosted here](${this.projectHostedUrl}) ` +
            'and meets the following criteria:\n\n' +
            `- [x] ${criteria.join('\n- [x] ')}\n\n` +
            '<!-- ADD YOUR OWN NOTES, IF ANY, BELOW THIS LINE -->'
        })
      ].join('')

      window.open(newIssueUrl, '_blank').focus()
    }
  }
}
</script>
