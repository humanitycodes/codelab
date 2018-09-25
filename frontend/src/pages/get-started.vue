<template>
  <Layout>
    <header>
      <h1>Welcome</h1>
      <p>
        To have the best experience possible, please complete all of these
        tasks.
      </p>
      <DoneButton
        :disabled="!allTasksDone"
        title="Press this button after completing all of the tasks."
        @click="completeUserSetup()"
      />
    </header>
    <Box>
      <NotificationsForm/>
    </Box>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/restricted'
import DoneButton from '@components/done-button'
import NotificationsForm from '@components/notifications-form'
import { userGetters } from '@state/helpers'

export default {
  components: {
    Layout, DoneButton, NotificationsForm
  },
  computed: {
    ...userGetters,
    allTasksDone () {
      return this.notificationsDone
    },
    notificationsDone () {
      return (
        !this.isMessagingSupportedByBrowser ||
        this.isMessagingAllowedByUser
      )
    }
  },
  methods: {
    completeUserSetup () {
      store.dispatch('completeUserSetup')
      .then(() => this.$router.replace('/'))
    }
  }
}
</script>
