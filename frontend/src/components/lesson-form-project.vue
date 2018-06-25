<template>
  <div class="flex-row" v-if="project">
    <div class="flex-col">
      <div class="flex-row">
        <div class="flex-col">
          <label for="project-title">Project Title</label>
          <input
            v-model="project.title"
            placeholder="Project title"
            id="project-title"
            name="project-title"
            class="lesson-project-title-input"
          >
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-col">
          <label for="project-new-criterion">Project Criteria</label>
          <input
            v-model="newProjectCriterion"
            @keydown.enter="addCriterion"
            id="project-new-criterion"
            name="project-new-criterion"
            placeholder="Add project criteria"
          >
          <OrderedEditableList :items="project.criteria">
            <template scope="list">
              <input
                v-model="list.item.content"
                :id="`project-criterion-${list.item['.position']}`"
                :name="`project-criterion-${list.item['.position']}`"
                :aria-label="`Project criterion ${list.item['.position']}`"
              >
            </template>
          </OrderedEditableList>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-col">
          <label for="project-hosting">Project Hosting</label>
          <select
            v-model="project.hosting"
            id="project-hosting"
            name="project-hosting"
          >
            <option
              v-for="hostingOption in hostingOptions"
              :key="hostingOption"
              :value="hostingOption"
            >{{ hostingOption }}</option>
          </select>
          <p v-if="!project.title" class="warning">
            This lesson's project needs a title so that people will understand the general idea of what they'll be building.
          </p>
        </div>
      </div>
      <p v-if="!project.criteria.length" class="warning">
        If the project doesn't have any criteria, students won't have clear expectations on when they'll have finished the project.
      </p>
    </div>
  </div>
</template>

<script>
import store from '@state/store'
import OrderedEditableList from './ordered-editable-list'

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
    project () {
      if (!this.lesson.projects.length) return
      const project = this.lesson.projects[0]
      if (!project.hosting) {
        project.hosting = this.hostingOptions[0]
      }
      return this.lesson.projects[0]
    },
    largeFieldsLoaded () {
      return !!store.state.firebase['raw-lessons'][this.lesson['.key']].large
    }
  },
  watch: {
    largeFieldsLoaded () {
      if (this.largeFieldsLoaded && !this.lesson.projects.length) {
        this.lesson.projects.add()
      }
    }
  },
  methods: {
    addCriterion () {
      this.project.criteria.add({
        content: this.newProjectCriterion
      })
      this.newProjectCriterion = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.lesson-project-title-input
  margin-bottom: $design.layout.gutterWidth * .5
</style>
