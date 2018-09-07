import randomatic from 'randomatic'
import moment from 'moment'

export default {
  user () {
    return {
      email: `${randomatic('a', 10)}@somewhere.com`,
      fullName: 'Test User',
      messagingToken: 'e2e-messaging-token'
    }
  },

  lesson (lesson) {
    return Object.assign({
      lessonKey: `css-${randomatic('a', 10)}`,
      title: 'Test Title',
      estimatedHours: 1,
      content: 'Test Content',
      notes: 'Test Lesson Notes',
      learningObjectives: [],
      prerequisiteLessonIds: []
    }, lesson || {})
  },

  course (course) {
    return Object.assign({
      courseKey: `MI-${randomatic('0', 3)}-FS${randomatic('0', 2)}-${randomatic('0', 3)}`,
      title: 'Test Course',
      credits: 2,
      syllabus: 'Test Syllabus',
      startDate: moment('2007-12-31', 'YYYY-MM-DD').startOf('day').valueOf(),
      endDate: moment('2087-12-31', 'YYYY-MM-DD').endOf('day').valueOf(),
      notes: 'Test Course Notes',
      instructorIds: [],
      lessonIds: [],
      studentIds: []
    }, course || {})
  }
}
