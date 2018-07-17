import waitTime from '../const/wait-time'
import signJsonWebToken from '../../../backend/dist/helpers/jwt/sign-json-web-token'

exports.command = function (user) {
  return this
    .url(this.launchUrl)
    .waitForElementVisible('.msu-standalone-signin-container', waitTime)
    .setLocalStorage('auth_token', signJsonWebToken({ user }))
    .url(this.launchUrl)
    .waitForElementVisible('.main-nav a[href^=\'/sign-out\']', waitTime)
}
