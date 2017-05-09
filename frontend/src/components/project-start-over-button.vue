<template>
  <div>
    <button
      type="button"
      name="start-over-button"
      class="danger block"
      @click="showStartOverModal"
    >
      Reset Project
    </button>
    <ModalConfirm
      :show="showModalConfirmStartOver"
      confirmClass="danger"
      confirmLabel="Reset"
      @close="onCloseStartOverModal"
    >
      <p>Resetting this project will permanently delete your GitHub repository! Are you sure you want to proceed?</p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'
import ModalConfirm from '@components/modal-confirm'

export default {
  components: {
    ModalConfirm
  },
  props: {
    projectCompletion: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showModalConfirmStartOver: false
    }
  },
  computed: {
    ...userGetters
  },
  methods: {
    showStartOverModal () {
      this.showModalConfirmStartOver = true
    },
    onCloseStartOverModal () {
      this.showModalConfirmStartOver = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

button[name=start-over-button]
  margin-bottom: 0
</style>
