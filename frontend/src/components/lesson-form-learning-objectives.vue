<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Learning Objectives</label>
      <input
        v-model="newLearningObjective"
        @keydown.enter="addObjective"
        name="lesson-new-learning-objective"
        placeholder="What new skills will students acquire?"
      >
      <OrderedEditableList :items="lesson.learningObjectives">
        <template scope="list">
          <input v-model="list.item.content">
        </template>
      </OrderedEditableList>
      <p v-if="!lesson.learningObjectives.length" class="warning">
        Learning objectives must be defined before a lesson can be added to a course. Add a new objective above, then press enter.
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
      newLearningObjective: ''
    }
  },
  methods: {
    addObjective (content) {
      this.lesson.learningObjectives.add({
        content: this.newLearningObjective
      })
      this.newLearningObjective = ''
    }
  }
}
</script>
