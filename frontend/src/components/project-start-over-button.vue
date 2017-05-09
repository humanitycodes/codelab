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
      :confirmDisabled="confirmResetText.toLowerCase() !== requiredResetText"
      confirmClass="danger"
      confirmLabel="Reset"
      @close="onCloseStartOverModal"
    >
      <div class="danger">
        This will <strong>permanently delete</strong> your project repository
        &mdash; including all issues &mdash; on GitHub and cannot be undone!
      </div>
      <p>
        If you want to undo your last commit, ask an instructor for help or look
        up <code>git reset HEAD~</code> instead.
      </p>
      <label for="confirm-reset-text">
        Please type "{{ requiredResetText }}" to confirm.
      </label>
      <input type="text" name="confirm-reset-text" v-model="confirmResetText">
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
      requiredResetText: 'delete my project',
      showModalConfirmStartOver: false,
      confirmResetText: ''
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
