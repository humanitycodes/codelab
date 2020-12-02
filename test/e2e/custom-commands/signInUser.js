import waitTime from '../const/wait-time'
import signJsonWebToken from '../../../backend/dist/helpers/jwt/sign-json-web-token'

exports.command = function (user) {
  return this
    .url(this.launchUrl)
    .waitForElementVisible('.msu-standalone-signin-container', waitTime)
    .setLocalStorage('auth_token', signJsonWebToken({ user }))
    .url(`${this.launchUrl}/get-started`)
    .waitForElementVisible('button[name=\'done-button\']', waitTime)
    .click('button[name=\'done-button\']')
    .waitForElementVisible('.main-nav a[href$=\'/courses\']', waitTime)
}
