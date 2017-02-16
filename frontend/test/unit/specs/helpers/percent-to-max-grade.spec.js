import percentToMaxGrade from '@helpers/percent-to-max-grade'

const achievedGradePoints = require('@helpers/achieved-grade-points')

describe('percent-to-max-grade.js', () => {
  let sandbox, achievedGradePointsStub

  before(() => {
    sandbox = sinon.sandbox.create()
    achievedGradePointsStub = sandbox.stub(achievedGradePoints, 'default')
  })

  after(() => {
    sandbox.restore()
  })

  it('returns 0% for 0 grade points', () => {
    achievedGradePointsStub.returns(0)
    expect(percentToMaxGrade({}, {})).to.equal(0)
  })

  it('returns 25% for 1.0 grade points', () => {
    achievedGradePointsStub.returns(1)
    expect(percentToMaxGrade({}, {})).to.equal(25)
  })

  it('returns 50% for 2.0 grade points', () => {
    achievedGradePointsStub.returns(2)
    expect(percentToMaxGrade({}, {})).to.equal(50)
  })

  it('returns 80% for 3.2 grade points', () => {
    achievedGradePointsStub.returns(3.2)
    expect(percentToMaxGrade({}, {})).to.equal(80)
  })

  it('returns 100% for 4.0 grade points', () => {
    achievedGradePointsStub.returns(4)
    expect(percentToMaxGrade({}, {})).to.equal(100)
  })

  it('returns 100% for more than 4.0 grade points', () => {
    achievedGradePointsStub.returns(4.1)
    expect(percentToMaxGrade({}, {})).to.equal(100)

    achievedGradePointsStub.returns(5)
    expect(percentToMaxGrade({}, {})).to.equal(100)
  })
})
