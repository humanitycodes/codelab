const uuid = require('uuid')
const randomatic = require('randomatic')

module.exports = {
  user: () => {
    let userKey = uuid.v4()
    return {
      key: userKey,
      email: `${userKey}@test.com`,
      fullName: 'Test User'
    }
  },

  lesson: (lesson) => {
    return Object.assign({
      key: `css-${randomatic('a', 10)}`,
      createdBy: {},
      title: 'Test Title',
      estimatedHours: 1,
      content: 'Test Content',
      notes: 'Test Lesson Notes',
      learningObjectives: {
        [`${uuid.v4()}`]: {
          content: 'Learn something'
        }
      }
    }, lesson)
  },

  course: (course) => {
    return Object.assign({
      key: `MI-${randomatic('0', 3)}-FS${randomatic('0', 2)}-${randomatic('0', 3)}`,
      createdBy: {},
      title: 'Test Course',
      credits: 2,
      syllabus: 'Test Syllabus',
      startDate: new Date('Mon Dec 31 2007 23:59:59 GMT-0500 (EST)').getTime(),
      endDate: new Date('Mon Dec 31 2087 23:59:59 GMT-0500 (EST)').getTime(),
      notes: 'Test Course Notes',
      lessonKeys: [],
      studentKeys: []
    }, course)
  }
}
