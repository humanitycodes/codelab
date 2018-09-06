<template>
  <span class="fa-stack fa-xs">
    <i class="far fa-square fa-stack-2x"></i>
    <i
      v-show="done"
      class="fas fa-check fa-stack-1x text-green-dark"
      :aria-label="done ? doneLabel : notDoneLabel"
    ></i>
  </span>
</template>

<script>
export default {
  props: {
    done: {
      type: Boolean,
      required: true
    },
    doneLabel: {
      type: String,
      required: true
    },
    notDoneLabel: {
      type: String,
      required: true
    }
  }
}
</script>
