// This custom reporter first calls the HTML reporter and when done() is
// called, performs test-suite-wide cleanup like disconnecting from the
// database because Nightwatch currently doesn't have a way to provide
// any sort of global cleanup.

import path from 'path'
import HtmlReporter from 'nightwatch-html-reporter'
import sequelize from '../../backend/dist/db/sequelize'

export default (results, done) => {
  const reportHtml = new HtmlReporter({
    openBrowser: false,
    reportsDirectory: path.join(__dirname, 'reports')
  }).fn

  reportHtml(results, error => {
    return sequelize.close()
      .then(() => done(error))
      .catch(() => done(error))
  })
}
