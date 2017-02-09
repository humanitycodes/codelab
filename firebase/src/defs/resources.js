import { any, isGreaterThan, hasRole, childIsFalsy, isOneOfTheseStrings, keyInResource } from '../generators/conditions'

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
      instructors: { resource: 'users' },
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
        },
        instructor: {
          preenrollments: {
            type: Array
          }
        }
      },
      large: {
        authed: {
          syllabus: String
        },
        student: {
          projectCompletions: {
            type: Array,
            fields: {
              committed: Boolean,
              firstSubmittedAt: Date,
              lastCommentedAt: Date,
              students: { type: Array },
              lessonKey: {
                validate: keyInResource('newData.val()', 'lessons')
              },
              projectKey: {
                validate: `root.child('lessons/large/student/'+data.parent().child('lessonKey').val()+'/projects/'+newData.val()).exists()`
              },
              submission: {
                fields: {
                  hostedUrl: String,
                  instructorCommentedLast: Boolean,
                  isApproved: Boolean,
                  assignedInstructor: {
                    validate: any(
                      `root.child('courses/relationships/'+$coursesKey+'/instructors/'+newData.val()).exists()`,
                      `root.child('courses/meta/'+$coursesKey+'/createdBy').val() === newData.val()`
                    )
                  }
                }
              }
            }
          }
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
          },
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
          content: String,
          projects: {
            type: Array,
            fields: {
              title: String,
              criteria: {
                type: Array,
                fields: {
                  content: String
                }
              },
              hosting: {
                type: String,
                validate: isOneOfTheseStrings(
                  'GitHub Pages', 'Surge', 'Heroku'
                )
              }
            }
          }
        },
        instructor: {
          notes: String
        }
      }
    }
  }
}
