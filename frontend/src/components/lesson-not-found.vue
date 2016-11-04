<template>
  <div>
    The lesson <strong>{{ badKey }}</strong> doesn't exist. Did you mean
    <router-link :to="suggestedLink">{{ suggestedKey }}</router-link>?
  </div>
</template>

<script>
import suggestedLessonKey from '@helpers/suggested-lesson-key'
import { lessonGetters } from '@state/helpers'

export default {
  computed: {
    ...lessonGetters,
    badKey () {
      return this.$route.params.lessonKey
    },
    suggestedKey () {
      return suggestedLessonKey(this.badKey, this.lessons)
    },
    suggestedLink () {
      return this.$route.fullPath.replace(this.badKey, this.suggestedKey)
    }
  }
}
</script>
