<template>
  <div>
    <h2>
      <DoneIndicator
        :done="isMessagingAllowedByUser"
        done-label="Notifications are on"
        not-done-label="Notifications are not on"
        error-label="Notifications are not supported in your browser"
        :error="!isMessagingSupportedByBrowser"
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
    <div v-if="!isMessagingSupportedByBrowser" class="danger">
      <h3>
        Your browser does not fully support this feature
      </h3>
      <p>
        Notifications allow you to receive updates without refreshing the
        page. If you would like to use this feature, download and use the
        newest version of
        <a href="https://www.google.com/chrome/">Chrome</a>
        or
        <a href="https://www.mozilla.org/firefox/download/">Firefox</a>.
      </p>
    </div>
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
      v-if="isMessagingSupportedByBrowser"
      name="enable-notifications-button"
      class="primary block max-w-xs mx-auto"
      :disabled="isMessagingAllowedByUser || requestingNotifications"
      @click="enableNotifications"
    >
      <span v-if="isMessagingAllowedByUser">
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
      initMessaging({ requestMessagingToken: true })
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
