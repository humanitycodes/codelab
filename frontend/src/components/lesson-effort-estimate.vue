<template>
  <div>
    <div v-if="brand === 'codelab517'">
      <div
        v-if="estimatedEffort"
        :title="
          'This lesson is likely to take a ' +
          estimatedEffort.full +
          ' amount of time to complete.'
        "
      >
        <span class="fas fa-tshirt"/>
        {{ estimatedEffort.abbreviation }}
      </div>
    </div>
    <div v-else>
      <div
        v-if="course"
        :title="'This lesson is worth ' + gradePoints + ' grade points.'"
      >
        <span class="fas fa-graduation-cap"/>
        {{ gradePoints }}
      </div>
    </div>
  </div>
</template>

<script>
import courseLessonGradePointsRounded from '@helpers/computed/course-lesson-grade-points-rounded'
import brand from '@env/brand'

const estimateMap = {
  1: {
    abbreviation: 'S',
    full: 'small'
  },
  2: {
    abbreviation: 'M',
    full: 'medium'
  },
  3: {
    abbreviation: 'L',
    full: 'large'
  }
}

export default {
  props: {
    course: Object,
    lesson: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      brand
    }
  },
  computed: {
    estimatedEffort () {
      return estimateMap[this.lesson.estimatedHours]
    },
    gradePoints () {
      return courseLessonGradePointsRounded(this.course, this.lesson)
    }
  }
}
</script>
