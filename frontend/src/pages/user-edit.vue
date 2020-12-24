<template>
  <Layout>
    <h1>User Profile</h1>
    <UserForm v-bind.sync="user"/>
    <div class="flex mb-4 -mx-2">
      <div class="w-1/2 px-2">
        <CancelButton @click="cancelEdit"/>
      </div>
      <div class="w-1/2 px-2">
        <DoneButton
          @click="saveUser"
          :disabled="!canSave"
          :saveButton="true"
        />
      </div>
    </div>
    <ModalConfirm
      :show="showModalConfirmLeaveUnsaved"
      confirmClass="danger"
      confirmLabel="Leave"
      @close="onCloseUnsavedModal"
    >
      <p>
        The changes you made will be lost if you leave
        this page without saving.
      </p>
      <aside>
        Are you sure you want to leave this page?
      </aside>
    </ModalConfirm>
    <ModalNotice
      :show="showModalErrorDuringSave"
      @close="onCloseModalErrorDuringSave"
    >
      <p>
        Something went wrong while trying to update your profile. Sign out and
        sign back in, then try again.
      </p>
    </ModalNotice>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/main'
import UserForm from '@components/user-form'
import DoneButton from '@components/done-button'
import CancelButton from '@components/cancel-button'
import ModalConfirm from '@components/modal-confirm'
import ModalNotice from '@components/modal-notice'
import deepCopy from '@helpers/utils/deep-copy'
import updateUser from '@api/users/update-user'
import goBackOrFallback from '@helpers/utils/go-back-or-fallback'
import { userGetters } from '@state/helpers'

export default {
  components: {
    Layout, UserForm, DoneButton, CancelButton, ModalConfirm, ModalNotice
  },
  data () {
    return {
      // Copy the user so the changes can be canceled
      user: deepCopy(store.getters.currentUser),
      showModalErrorDuringSave: false,
      showModalConfirmLeaveUnsaved: false,
      processingSave: false
    }
  },
  computed: {
    ...userGetters,
    canSave () {
      return this.isValid && this.isChanged
    },
    isChanged () {
      return this.currentUser.fullName !== this.user.fullName
    },
    isValid () {
      return this.user.fullName && this.user.fullName.trim().length
    }
  },
  methods: {
    saveUser () {
      this.processingSave = true
      const updatedUser = {
        // Set the fields that can be changed or identify the user
        userId: this.user.userId,
        version: this.user.version,
        fullName: this.user.fullName
      }
      updateUser(updatedUser)
        .catch(error => {
          this.showModalErrorDuringSave = true
          throw error
        })
        .then(() => goBackOrFallback())
    },
    onCloseUnsavedModal (confirmed) {
      if (confirmed) {
        goBackOrFallback()
      } else {
        this.showModalConfirmLeaveUnsaved = false
      }
    },
    onCloseModalErrorDuringSave () {
      this.showModalErrorDuringSave = false
    },
    cancelEdit () {
      if (this.isChanged) {
        this.showModalConfirmLeaveUnsaved = true
      } else {
        goBackOrFallback()
      }
    }
  }
}
</script>
