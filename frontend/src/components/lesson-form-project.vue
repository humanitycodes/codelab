<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <div class="stretch-row">
        <div class="stretch-col">
          <label for="project-title">Project Title</label>
          <input
            v-model="lesson.projectTitle"
            placeholder="Project title"
            @input="onInput"
            id="project-title"
            name="project-title"
            class="lesson-project-title-input"
          >
        </div>
      </div>
      <div class="stretch-row">
        <div class="stretch-col">
          <label for="project-new-criterion">Project Criteria</label>
          <input
            v-model="newProjectCriterion"
            @keydown.enter="addCriterion"
            id="project-new-criterion"
            name="project-new-criterion"
            placeholder="Add project criteria"
          >
          <OrderedEditableList :items="sortedProjectCriteria">
            <template slot-scope="list">
              <input
                v-model="list.item.content"
                :id="`project-criterion-${list.item.position}`"
                :name="`project-criterion-${list.item.position}`"
                :aria-label="`Project criterion ${list.item.position}`"
              >
            </template>
          </OrderedEditableList>
        </div>
      </div>
      <div class="stretch-row">
        <div class="stretch-col">
          <label for="project-hosting">Project Hosting</label>
          <select
            v-model="lesson.projectHosting"
            id="project-hosting"
            name="project-hosting"
          >
            <option
              v-for="hostingOption in hostingOptions"
              :key="hostingOption"
              :value="hostingOption"
            >{{ hostingOption }}</option>
          </select>
          <p v-if="!lesson.projectTitle" class="warning">
            This lesson's project needs a title so that people will understand
            the general idea of what they'll be building.
          </p>
        </div>
      </div>
      <p v-if="!lesson.projectCriteria.length" class="warning">
        If the project doesn't have any criteria, students won't have clear
        expectations on when they'll have finished the project.
      </p>
    </div>
  </div>
</template>

<script>
import OrderedEditableList from './ordered-editable-list'
import orderBy from 'lodash/orderBy'

export default {
  components: {
    OrderedEditableList
  },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      newProjectCriterion: '',
      hostingOptions: [
        'GitHub Pages',
        'Surge',
        'Heroku'
      ]
    }
  },
  computed: {
    sortedProjectCriteria () {
      return orderBy(
        this.lesson.projectCriteria,
        [criterion => criterion.position]
      )
    }
  },
  methods: {
    addCriterion () {
      this.lesson.projectCriteria.push({
        content: this.newProjectCriterion,
        position: this.lesson.projectCriteria.length
      })
      this.newProjectCriterion = ''
    },
    onInput () {
      if (this.lesson.projectTitle === '') {
        this.lesson.projectTitle = null
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.lesson-project-title-input
  margin-bottom: $design.layout.gutterWidth * .5
</style>
