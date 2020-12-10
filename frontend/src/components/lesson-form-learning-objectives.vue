<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-new-learning-objective">Learning Objectives</label>
      <input
        v-model="newLearningObjective"
        @keydown.enter="addObjective"
        id="lesson-new-learning-objective"
        name="lesson-new-learning-objective"
        placeholder="What new skills will students acquire?"
      >
      <OrderedEditableList
        :items="sortedLearningObjectives"
        @update:items="$emit('update:learningObjectives', $event)"
      >
        <template slot-scope="list">
          <input
            :value="list.item.content"
            @input="updateContent(list.item.position, $event.target.value)"
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
import deepCopy from '@helpers/utils/deep-copy'
import sortByPosition from '@helpers/utils/sort-by-position'

export default {
  components: {
    OrderedEditableList
  },
  props: {
    learningObjectives: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      newLearningObjective: ''
    }
  },
  computed: {
    sortedLearningObjectives () {
      return sortByPosition(this.learningObjectives)
    }
  },
  methods: {
    addObjective () {
      if (!this.newLearningObjective.trim().length) return
      const modifiedLearningObjectives = this.learningObjectives.concat({
        content: this.newLearningObjective,
        position: this.learningObjectives.length
      })
      this.$emit('update:learningObjectives', modifiedLearningObjectives)
      this.newLearningObjective = ''
    },
    updateContent (position, content) {
      const modifiedLearningObjectives = deepCopy(this.learningObjectives)
      const foundLearningObjective = modifiedLearningObjectives.find(
        objective => objective.position === position
      )
      if (foundLearningObjective) {
        foundLearningObjective.content = content
        this.$emit('update:learningObjectives', modifiedLearningObjectives)
      }
    }
  }
}
</script>
