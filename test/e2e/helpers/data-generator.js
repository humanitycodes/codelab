import randomatic from 'randomatic'

export default {
  user () {
    return {
      email: `${randomatic('a', 10)}@somewhere.com`,
      fullName: 'Test User'
    }
  },

  lesson (lesson) {
    return Object.assign({
      lessonKey: `css-${randomatic('a', 10)}`,
      title: 'Test Title',
      estimatedHours: 1,
      content: 'Test Content',
      notes: 'Test Lesson Notes',
      learningObjectives: [
        {
          position: 0,
          content: 'Learn something'
        }
      ],
      prerequisiteLessonIds: []
    }, lesson || {})
  },

  course (course) {
    return Object.assign({
      courseKey: `MI-${randomatic('0', 3)}-FS${randomatic('0', 2)}-${randomatic('0', 3)}`,
      title: 'Test Course',
      credits: 2,
      syllabus: 'Test Syllabus',
      startDate: new Date('Mon Dec 31 2007 23:59:59 GMT-0500 (EST)').getTime(),
      endDate: new Date('Mon Dec 31 2087 23:59:59 GMT-0500 (EST)').getTime(),
      notes: 'Test Course Notes',
      instructorIds: [],
      lessonIds: [],
      studentIds: []
    }, course || {})
  }
}
