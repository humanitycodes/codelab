<template>
  <div class="form-row">
    <div class="form-group">
      <label>Learning Objectives</label>
      <input
        v-model="newLearningObjective"
        @keydown.enter="addObjective"
        placeholder="What new skills will students acquire?"
      >
      <ul v-if="lesson.learningObjectives">
        <li v-for="(objective, key) in lesson.learningObjectives">
          {{ objective.content }}
          <button
            @click="removeObjective(key)"
            class="inline danger"
          >X</button>
        </li>
      </ul>
      <p v-else class="warning">
        Learning objectives must be defined before a lesson can be added to a course. Add a new objective above, then press enter.
      </p>
    </div>
  </div>
</template>

<script>
import db from '@plugins/firebase'

export default {
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
    addObjective () {
      db.ref('lessons')
        .child(this.lesson['.key'])
        .child('learningObjectives')
        .push({
          content: this.newLearningObjective
        })
      this.newLearningObjective = ''
    },
    removeObjective (objectiveKey) {
      db.ref('lessons')
        .child(this.lesson['.key'])
        .child('learningObjectives')
        .child(objectiveKey)
        .remove()
    }
  }
}
</script>
