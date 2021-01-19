<template>
  <section>
    <h2
      aria-haspopup="listbox"
      class="mt-4 mb-2 cursor-pointer"
      @click="showContent = !showContent"
    >
      <span
        :class="showContent ? 'fa-caret-down' : 'fa-caret-right'"
        class="fas fa-fw"
        role="img"
      ></span>
      {{ title }}
    </h2>
    <transition name="fade">
      <div v-show="showContent" :aria-expanded="showContent || 'false'">
        <slot></slot>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showContent: this.expanded
    }
  }
}
</script>
