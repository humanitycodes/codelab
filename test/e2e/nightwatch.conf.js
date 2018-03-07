const HtmlReporter = require('nightwatch-html-reporter');
const config = require('../../frontend/config')

const reporter = new HtmlReporter({
	openBrowser: false,
	reportsDirectory: __dirname + '/reports'
})

// http://nightwatchjs.org/guide#settings-file
module.exports = {
  src_folders: ['e2e/specs'],
  output_folder: 'e2e/reports',
  custom_assertions_path: ['e2e/custom-assertions'],

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
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        reporter: reporter.fn,
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
