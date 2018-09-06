<template>
  <div>
    <h2>
      <span class="fa-stack fa-xs">
        <i class="far fa-square fa-stack-2x"></i>
        <i
          v-show="notificationsEnabled"
          class="fas fa-check fa-stack-1x text-green-dark"
          :aria-label="
            notificationsEnabled
              ? 'Notifications are enabled'
              : 'Notifications are not enabled'
          "
        ></i>
      </span>
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
    <button
      name="enable-notifications-button"
      class="primary block"
      :disabled="notificationsEnabled || requestingNotifications"
      @click="enableNotifications"
    >
      <span v-if="notificationsEnabled">
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
import { userGetters } from '@state/helpers'

export default {
  data () {
    return {
      requestingNotifications: false
    }
  },
  computed: {
    ...userGetters,
    notificationsEnabled () {
      return !this.hasMessagingToken
    }
  },
  methods: {
    enableNotifications () {
      this.requestingNotifications = true
    }
  }
}
</script>
