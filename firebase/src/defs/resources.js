import { isGreaterThan, hasRole, childIsFalsy } from '../generators/conditions'

export default {
  courses: {
    matches: /^[-A-Z0-9]+$/,
    permissions: {
      create: hasRole('instructor'),
      update: hasRole('instructor'),
      destroy: childIsFalsy('relationships/students')
    },
    relationships: {
      students: { resource: 'users' },
      lessons: true
    },
    fieldGroups: {
      small: {
        authed: {
          title: String,
          credits: {
            type: 'Integer',
            validate: isGreaterThan(0)
          },
          startDate: Date,
          endDate: Date
        }
      },
      large: {
        authed: {
          syllabus: String
        }
      }
    }
  },
  lessons: {
    matches: /^[-a-z]+$/,
    permissions: {
      create: hasRole('instructor'),
      update: hasRole('instructor'),
      destroy: childIsFalsy('relationships/courses')
    },
    relationships: {
      // Get all the lessons a students has access to
      students: {
        derivedFrom: { resource: 'courses' }
      },
      // Get all the lessons in a course
      courses: true,
      // Get all the prerequisites for the course
      prereqs: {
        resource: 'lessons',
        foreignKey: 'postreqs'
      },
      // Get all the postrequisites for the course
      postreqs: {
        resource: 'lessons',
        foreignKey: 'prereqs'
      }
    },
    fieldGroups: {
      small: {
        student: {
          title: String,
          estimatedHours: {
            type: Number,
            validate: isGreaterThan(0)
          }
        },
        instructor: {
          learningObjectives: {
            type: Array,
            fields: {
              content: String
            }
          }
        }
      },
      large: {
        student: {
          content: String
        },
        instructor: {
          notes: String
        }
      }
    }
  }
}
