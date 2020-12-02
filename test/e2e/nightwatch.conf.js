import reportAndCleanup from './report-and-cleanup'
import backendServerPort from '../../backend/env/port'

module.exports = {
  src_folders: ['dist/specs'],
  output_folder: 'dist/e2e-reports',
  custom_assertions_path: ['dist/custom-assertions'],
  custom_commands_path: 'dist/custom-commands',

  webdriver: {
    start_process: true,
    server_path: 'node_modules/.bin/chromedriver',
    port: 9515
  },

  test_settings: {
    default: {
      launch_url: `http://localhost:${backendServerPort}`,
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
    }
  }
}
