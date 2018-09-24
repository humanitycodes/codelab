<template>
  <Modal :show="show" @close="close">
    <main>
      <slot></slot>
    </main>
    <footer>
      <button
        name="confirm-button"
        @click="() => { close(true) }"
      >
        Close
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
    }
  },
  methods: {
    close (result) {
      this.$emit('close', result)
    }
  }
}
</script>
