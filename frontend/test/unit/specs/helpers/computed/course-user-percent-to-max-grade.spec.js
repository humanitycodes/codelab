import courseUserPercentToMaxGrade from '@helpers/computed/course-user-percent-to-max-grade'
const courseUserGradeCurrentReal = require('@helpers/computed/course-user-grade-current-real')

describe('@helpers/computed/course-user-percent-to-max-grade.js', () => {
  let sandbox, courseUserGradeCurrentRealStub

  before(() => {
    sandbox = sinon.createSandbox()
    courseUserGradeCurrentRealStub = sandbox.stub(courseUserGradeCurrentReal, 'default')
  })

  after(() => {
    sandbox.restore()
  })

  it('returns 0% for 0 grade points', () => {
    courseUserGradeCurrentRealStub.returns(0)
    expect(courseUserPercentToMaxGrade()).to.equal(0)
  })

  it('returns 25% for 1.0 grade points', () => {
    courseUserGradeCurrentRealStub.returns(1)
    expect(courseUserPercentToMaxGrade()).to.equal(25)
  })

  it('returns 50% for 2.0 grade points', () => {
    courseUserGradeCurrentRealStub.returns(2)
    expect(courseUserPercentToMaxGrade()).to.equal(50)
  })

  it('returns 80% for 3.2 grade points', () => {
    courseUserGradeCurrentRealStub.returns(3.2)
    expect(courseUserPercentToMaxGrade()).to.equal(80)
  })

  it('returns 100% for 4.0 grade points', () => {
    courseUserGradeCurrentRealStub.returns(4)
    expect(courseUserPercentToMaxGrade()).to.equal(100)
  })

  it('returns 100% for more than 4.0 grade points', () => {
    courseUserGradeCurrentRealStub.returns(4.1)
    expect(courseUserPercentToMaxGrade()).to.equal(100)

    courseUserGradeCurrentRealStub.returns(5)
    expect(courseUserPercentToMaxGrade()).to.equal(100)
  })
})
