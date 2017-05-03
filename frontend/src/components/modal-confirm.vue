<template>
  <Modal :show="show" @close="close">
    <main>
      <slot></slot>
    </main>
    <footer>
      <button
        :class="confirmClass"
        name="confirm-button"
        @click="() => { close(true) }"
      >
        {{ confirmLabel }}
      </button>
      <button
        name="cancel-button"
        @click="() => { close(false) }"
      >
        Cancel
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
    confirmClass: {
      type: String,
      default: 'primary'
    },
    confirmLabel: {
      type: String,
      default: 'OK'
    }
  },
  methods: {
    close (result) {
      this.$emit('close', result)
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

.modal-container aside
  font-size: smaller
  font-style: italic
  margin: $design.layout.gutterWidth auto

.modal-container footer
  border-top: 1px solid $design.control.border.color
  text-align: right
  padding-top: $design.layout.gutterWidth
</style>
