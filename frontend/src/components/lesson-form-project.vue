<template>
  <div class="flex-row" v-if="project">
    <div class="flex-col">
      <label>Project</label>
      <input
        v-model="project.title"
        placeholder="Project title"
        class="lesson-project-title-input"
      >
      <p v-if="!project.title" class="warning">
        This lesson's project needs a title so that people will understand the general idea of what they'll be building.
      </p>
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
      newProjectCriterion: ''
    }
  },
  computed: {
    project () {
      if (!this.lesson.projects.length) return
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
