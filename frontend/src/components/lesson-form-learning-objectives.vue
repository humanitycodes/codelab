<template>
  <div class="flex-row">
    <div class="flex-col">
      <label for="lesson-new-learning-objective">Learning Objectives</label>
      <input
        v-model="newLearningObjective"
        @keydown.enter="addObjective"
        id="lesson-new-learning-objective"
        name="lesson-new-learning-objective"
        placeholder="What new skills will students acquire?"
      >
      <OrderedEditableList :items="lesson.learningObjectives">
        <template slot-scope="list">
          <input
            v-model="list.item.content"
            :id="`learning-objective-${list.item.position}`"
            :name="`learning-objective-${list.item.position}`"
            :aria-label="`Learning objective ${list.item.position}`"
          >
        </template>
      </OrderedEditableList>
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
      this.lesson.learningObjectives.push({
        content: this.newLearningObjective,
        position: this.lesson.learningObjectives.length
      })
      this.newLearningObjective = ''
    }
  }
}
</script>
