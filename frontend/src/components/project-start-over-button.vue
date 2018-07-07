<template>
  <div>
    <p v-if="error" class="error">{{ error }}</p>
    <button
      type="button"
      name="start-over-button"
      class="danger block"
      @click="showStartOverModal"
      :disabled="resetting"
    >
      <span v-if="resetting">
        Just a few seconds...
      </span>
      <span v-else>
        Reset Project
      </span>
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
      <input
        type="text"
        id="confirm-reset-text"
        name="confirm-reset-text"
        v-model="confirmResetText"
      >
    </ModalConfirm>
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'
import ModalConfirm from '@components/modal-confirm'
import deleteProjectCompletion from '@api/project-completions/delete-project-completion'

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
      confirmResetText: '',
      resetting: false,
      error: ''
    }
  },
  computed: userGetters,
  methods: {
    showStartOverModal () {
      this.showModalConfirmStartOver = true
    },
    onCloseStartOverModal (confirmed) {
      this.showModalConfirmStartOver = false
      this.confirmResetText = ''
      if (confirmed) {
        this.resetProject()
      }
    },
    resetProject () {
      this.resetting = true
      this.error = ''

      deleteProjectCompletion(this.projectCompletion.projectCompletionId)
      .then(() => {
        this.resetting = false
      })
      .catch(error => {
        this.resetting = false
        this.error = `
          There was a problem resetting the project. Please tell your instructor
          so the issue can be resolved as soon as possible.
        `
        console.error('Failed to reset project. Reason:', error)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

button[name=start-over-button]
  margin-bottom: 0
</style>
