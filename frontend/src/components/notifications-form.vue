<template>
  <div>
    <h2>
      <DoneIndicator
        :done="messagingToken"
        done-label="Notifications are on"
        not-done-label="Notifications are not on"
      />
      Turn on notifications
    </h2>
    <p>
      Notifications let us to send you updates like code review feedback
      as soon as they happen.
    </p>
    <p>
      When you press the button, a popup will appear asking if we can show
      you notifications. Choose "Allow" when this happens. If you press
      "Block" or the popup does't appear, notify an instructor.
    </p>
    <div v-if="showErrorMessage" class="error">
      <h3>
        Something went wrong while turning on notifications.
      </h3>
      <p>
        If you clicked "Block" by mistake, add
        <code>{{ originatingWebsite }}</code>
        to the list of allowed websites in your browser's push notification
        settings.
      </p>
      <p>
        Then press the button to try again. If that doesn't work, notify an
        instructor.
      </p>
    </div>
    <button
      name="enable-notifications-button"
      class="primary block max-w-xs mx-auto"
      :disabled="messagingToken || requestingNotifications"
      @click="enableNotifications"
    >
      <span v-if="messagingToken">
        Notifications are turned on! 🎉
      </span>
      <span v-else-if="requestingNotifications">
        Turning on notifications...
      </span>
      <span v-else>
        Turn on notifications
      </span>
    </button>
  </div>
</template>

<script>
import DoneIndicator from '@components/indicator-done'
import { userGetters } from '@state/helpers'
import initMessaging from '@notifications/init-messaging'

export default {
  components: {
    DoneIndicator
  },
  data () {
    return {
      originatingWebsite: window.location.origin,
      requestingNotifications: false,
      showErrorMessage: false
    }
  },
  computed: userGetters,
  methods: {
    enableNotifications () {
      this.requestingNotifications = true
      initMessaging()
      .then(() => {
        this.showErrorMessage = false
        this.requestingNotifications = false
      })
      .catch(error => {
        console.error('Notifications could not be turned on because:', error)
        this.showErrorMessage = true
        this.requestingNotifications = false
      })
    }
  }
}
</script>
