<template>
  <div class="flex-row" v-if="project">
    <div class="flex-col">
      <div class="flex-row">
        <div class="flex-col">
          <label>Project Title</label>
          <input
            v-model="project.title"
            placeholder="Project title"
            class="lesson-project-title-input"
          >
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-col">
          <label>Project Criteria</label>
          <input
            v-model="newProjectCriterion"
            @keydown.enter="addCriterion"
            placeholder="Add project criteria"
          >
          <OrderedEditableList :items="project.criteria">
            <template scope="list">
              <input v-model="list.item.content">
            </template>
          </OrderedEditableList>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-col">
          <label>Project Hosting</label>
          <select v-model="project.hosting">
            <option
              v-for="hostingOption in hostingOptions"
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
      return !!this.$store.state.firebase['raw-lessons'][this.lesson['.key']].large
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
