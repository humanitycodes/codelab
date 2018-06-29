<template>
  <div>
    The lesson <strong>{{ badKey }}</strong> doesn't exist. Did you mean
    <router-link :to="suggestedLink">{{ suggestedKey }}</router-link>?
  </div>
</template>

<script>
import getSuggestedKey from '@helpers/utils/get-suggested-key'
import { lessonGetters } from '@state/helpers'

export default {
  computed: {
    ...lessonGetters,
    badKey () {
      return this.$route.params.lessonKey
    },
    suggestedKey () {
      return getSuggestedKey(
        this.badKey,
        this.lessons.map(lesson => lesson.lessonKey)
      )
    },
    suggestedLink () {
      return this.$route.fullPath.replace(this.badKey, this.suggestedKey)
    }
  }
}
</script>
