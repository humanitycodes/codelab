<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <div class="stretch-row">
        <div class="stretch-col">
          <label for="project-title">Project Title</label>
          <input
            :value="projectTitle"
            placeholder="Project title"
            @input="onProjectTitleInput"
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
            @keydown.enter="addProjectCriterion"
            id="project-new-criterion"
            name="project-new-criterion"
            placeholder="Add project criteria"
          >
          <OrderedEditableList
            :items="sortedProjectCriteria"
            @update:items="$emit('update:projectCriteria', $event)"
          >
            <template slot-scope="list">
              <input
                :value="list.item.content"
                @input="updateProjectCriterion(
                  list.item.position, $event.target.value
                )"
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
            :value="projectHosting"
            @change="onProjectHostingChange"
            id="project-hosting"
            name="project-hosting"
          >
            <option
              v-for="hostingOption in hostingOptions"
              :key="hostingOption"
              :value="hostingOption"
            >{{ hostingOption }}</option>
          </select>
          <p v-if="!projectTitle" class="warning">
            This lesson's project needs a title so that people will understand
            the general idea of what they'll be building.
          </p>
        </div>
      </div>
      <p v-if="!projectCriteria.length" class="warning">
        If the project doesn't have any criteria, students won't have clear
        expectations on when they'll have finished the project.
      </p>
    </div>
  </div>
</template>

<script>
import OrderedEditableList from './ordered-editable-list'
import sortByPosition from '@helpers/utils/sort-by-position'
import deepCopy from '@helpers/utils/deep-copy'

export default {
  components: {
    OrderedEditableList
  },
  props: {
    projectTitle: String,
    projectHosting: String,
    projectCriteria: {
      type: Array,
      default: () => []
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
      return sortByPosition(this.projectCriteria)
    }
  },
  methods: {
    addProjectCriterion () {
      if (!this.newProjectCriterion.trim().length) return
      const modifiedProjectCriteria = this.projectCriteria.concat({
        content: this.newProjectCriterion,
        position: this.projectCriteria.length
      })
      this.$emit('update:projectCriteria', modifiedProjectCriteria)
      this.newProjectCriterion = ''
    },
    updateProjectCriterion (position, content) {
      const modifiedProjectCriteria = deepCopy(this.projectCriteria)
      const foundProjectCriterion = modifiedProjectCriteria.find(
        objective => objective.position === position
      )
      if (foundProjectCriterion) {
        foundProjectCriterion.content = content
        this.$emit('update:projectCriteria', modifiedProjectCriteria)
      }
    },
    onProjectTitleInput (event) {
      this.$emit('update:projectTitle', event.target.value || null)
    },
    onProjectHostingChange (event) {
      const hostingValue = event.target.value
      if (this.hostingOptions.includes(hostingValue)) {
        return this.$emit('update:projectHosting', hostingValue)
      } else {
        return this.$emit('update:projectHosting', null)
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
