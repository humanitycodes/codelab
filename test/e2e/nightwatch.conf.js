import reportAndCleanup from './report-and-cleanup'
import backendServerPort from '../../backend/env/port'

module.exports = {
  src_folders: ['dist/specs'],
  output_folder: 'dist/e2e-reports',
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
      launch_url: `http://localhost:${backendServerPort}`,
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: 'dist/e2e-reports/screenshots'
      },
      globals: {
        reporter: reportAndCleanup
      },
      desiredCapabilities: {
        webStorageEnabled: true,
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--disable-notifications']
        }
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }
  }
}
