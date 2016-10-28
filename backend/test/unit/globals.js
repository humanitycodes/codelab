process.env.NODE_ENV = 'test'
global.src = '../../../../dist'

const chai = require('chai')

global.expect = chai.expect
global.assert = chai.assert
chai.should()

global.sinon = require('sinon')

chai.use(require('sinon-chai'))

// Homemade helpers
chai.use(require('./helpers/routes/resolve'))
