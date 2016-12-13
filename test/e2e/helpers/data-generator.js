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

  lesson: ({ createdBy }) => {
    return {
      key: `css-${randomatic('a', 10)}`,
      createdBy: createdBy,
      title: 'Test Title',
      estimatedHours: 4,
      content: 'Test Content',
      notes: 'Test Lesson Notes',
      learningObjectives: {
        [`${uuid.v4()}`]: {
          content: 'Learn something'
        }
      }
    }
  },

  course: ({ createdBy }) => {
    let courseKey = uuid.v4().toUpperCase()
    return {
      key: courseKey,
      createdBy: createdBy,
      title: 'Test Course',
      credits: 2,
      syllabus: 'Test Syllabus',
      startDate: new Date('Mon Dec 31 2007 23:59:59 GMT-0500 (EST)').getTime(),
      endDate: new Date('Mon Dec 31 2087 23:59:59 GMT-0500 (EST)').getTime(),
      notes: 'Test Course Notes',
      lessonKeys: [],
      studentKeys: []
    }
  }
}
