export default () => (
  window.Notification &&
  window.Notification.permission === 'granted'
)
