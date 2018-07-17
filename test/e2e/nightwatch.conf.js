import path from 'path'
import HtmlReporter from 'nightwatch-html-reporter'

const config = require('../../frontend/config')

const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: path.join(__dirname, 'reports')
}).fn

// http://nightwatchjs.org/guide#settings-file
module.exports = {
  src_folders: ['dist/specs'],
  output_folder: 'dist/reports',
  custom_assertions_path: ['dist/custom-assertions'],
  custom_commands_path: 'dist/custom-commands',

  selenium: {
    start_process: true,
    server_path: 'node_modules/selenium-server/lib/runner/selenium-server-standalone-3.8.1.jar',
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost:' + (process.env.PORT || config.dev.port),
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        reporter
      },
      desiredCapabilities: {
        webStorageEnabled: true,
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }
  }
}
