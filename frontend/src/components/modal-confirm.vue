<template>
  <Modal :show="show" @close="close">
    <main>
      <slot></slot>
    </main>
    <footer>
      <button
        :class="confirmClass"
        :disabled="confirmDisabled"
        name="confirm-button"
        @click="() => { close(true) }"
      >
        {{ confirmLabel }}
      </button>
      <button
        name="cancel-button"
        @click="() => { close(false) }"
      >
        {{ cancelLabel }}
      </button>
    </footer>
  </Modal>
</template>

<script>
import Modal from './modal'

export default {
  components: {
    Modal
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    confirmClass: {
      type: String,
      default: 'primary'
    },
    confirmLabel: {
      type: String,
      default: 'OK'
    },
    confirmDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close (result) {
      this.$emit('close', result)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.modal-container aside
  font-size: smaller
  font-style: italic
  margin: $design.layout.gutterWidth auto
</style>
