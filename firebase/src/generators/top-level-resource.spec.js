import { isGreaterThan, hasRole, childIsFalsy } from './conditions'
import generateTopLevelResource from './top-level-resource'

describe('generateTopLevelResource', () => {
  it('returns the correct rules lessons resource', () => {
    const rules = generateTopLevelResource('lessons', {
      matches: /^[-a-z]+$/,
      permissions: {
        create: hasRole('instructor'),
        update: hasRole('instructor'),
        destroy: childIsFalsy('relationships/students')
      },
      relationships: {
        // Get all the lessons a students has access to
        students: { resource: 'users' },
        // Get all the lessons in a course
        courses: true,
        // Get all the prerequisites for the course
        prereqs: { resource: 'lessons' },
        // Get all the postrequisites for the course
        postreqs: { resource: 'lessons' }
      },
      fieldGroups: {
        small: {
          authed: {
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
          authed: {
            content: String
          },
          instructor: {
            notes: String
          }
        }
      }
    })
    expect(rules).toEqual({
      'lessons': {
        '.write': "((!data.exists() && root.child('roles/'+auth.uid+'/instructor').val() === true) || (data.exists() && newData.exists() && root.child('roles/'+auth.uid+'/instructor').val() === true) || (data.exists() && !newData.exists() && (!newData.child('relationships/students').exists() || newData.child('relationships/students').val() === false)))",
        $other: {
          '.validate': false
        },
        'meta': {
          '.read': 'auth !== null',
          '$lessonsKey': {
            '$other': {
              '.validate': false
            },
            'createdAt': {
              '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
            },
            'createdBy': {
              '.validate': "root.child('users/'+newData.val()).exists()"
            },
            'updatedAt': {
              '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
            },
            'updatedBy': {
              '.validate': "root.child('users/'+newData.val()).exists()"
            }
          }
        },
        'fieldGroups': {
          'large': {
            'authed': {
              '$lessonsKey': {
                '$other': {
                  '.validate': false
                },
                '.read': 'auth !== null',
                '.validate': '$lessonsKey.matches(/^[-a-z]+$/)',
                'content': {
                  '.validate': 'newData.isString()'
                }
              }
            },
            'instructor': {
              '$lessonsKey': {
                '$other': {
                  '.validate': false
                },
                '.read': "root.child('roles/'+auth.uid+'/instructor').val() === true",
                '.validate': '$lessonsKey.matches(/^[-a-z]+$/)',
                'notes': {
                  '.validate': 'newData.isString()'
                }
              }
            }
          },
          'small': {
            'authed': {
              '$lessonsKey': {
                '$other': {
                  '.validate': false
                },
                '.read': 'auth !== null',
                '.validate': '$lessonsKey.matches(/^[-a-z]+$/)',
                'estimatedHours': {
                  '.validate': '(newData.isNumber() && newData.val() > 0)'
                },
                'title': {
                  '.validate': 'newData.isString()'
                }
              }
            },
            'instructor': {
              '$lessonsKey': {
                '$other': {
                  '.validate': false
                },
                '.read': "root.child('roles/'+auth.uid+'/instructor').val() === true",
                '.validate': '$lessonsKey.matches(/^[-a-z]+$/)',
                'learningObjectives': {
                  '$learningObjectivesKey': {
                    '$other': {
                      '.validate': false
                    },
                    position: {
                      '.validate': '((newData.isNumber() && newData.val() % 1 === 0) && newData.val() > 0)'
                    },
                    'content': {
                      '.validate': 'newData.isString()'
                    }
                  }
                }
              }
            }
          }
        },
        'relationships': {
          '.read': 'auth !== null',
          '$lessonsKey': {
            '$other': {
              '.validate': false
            },
            'courses': {
              '$coursesKey': {
                '$other': {
                  '.validate': false
                },
                '.validate': "(root.child('courses/'+$coursesKey).exists() || root.child('courses/meta/'+$coursesKey).exists())",
                'createdAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'createdBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                },
                'updatedAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'updatedBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                }
              }
            },
            'postreqs': {
              '$postreqsKey': {
                '$other': {
                  '.validate': false
                },
                '.validate': "((root.child('lessons/'+$postreqsKey).exists() || root.child('lessons/meta/'+$postreqsKey).exists()) && $postreqsKey !== $lessonsKey)",
                'createdAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'createdBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                },
                'updatedAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'updatedBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                }
              }
            },
            'prereqs': {
              '$prereqsKey': {
                '$other': {
                  '.validate': false
                },
                '.validate': "((root.child('lessons/'+$prereqsKey).exists() || root.child('lessons/meta/'+$prereqsKey).exists()) && $prereqsKey !== $lessonsKey)",
                'createdAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'createdBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                },
                'updatedAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'updatedBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                }
              }
            },
            'students': {
              '$studentsKey': {
                '$other': {
                  '.validate': false
                },
                '.validate': "(root.child('users/'+$studentsKey).exists() || root.child('users/meta/'+$studentsKey).exists())",
                'createdAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'createdBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                },
                'updatedAt': {
                  '.validate': '(newData.isNumber() && newData.val() % 1 === 0)'
                },
                'updatedBy': {
                  '.validate': "root.child('users/'+newData.val()).exists()"
                }
              }
            }
          }
        }
      }
    })
  })
})
