import generateRelationships from './relationships'

describe('generateRelationships', () => {
  it('returns the correct rules for a complex object', () => {
    const rules = generateRelationships('courses', {
      students: {
        resource: 'users'
      },
      coursePrereqs: {
        resource: 'courses',
        fields: {
          connectionRating: Number
        }
      },
      lessons: true
    })
    expect(rules).toEqual({
      students: {
        $studentsKey: {
          '.validate': `root.child('users/'+$studentsKey).exists()`,
          createdAt: {
            '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
          },
          createdBy: {
            '.validate': `root.child('users/'+newData.val()).exists()`
          },
          updatedAt: {
            '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
          },
          updatedBy: {
            '.validate': `root.child('users/'+newData.val()).exists()`
          },
          $other: { '.validate': false }
        }
      },
      coursePrereqs: {
        $coursePrereqsKey: {
          '.validate': `(root.child('courses/meta/'+$coursePrereqsKey).exists() && $coursePrereqsKey !== $coursesKey)`,
          createdAt: {
            '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
          },
          createdBy: {
            '.validate': `root.child('users/'+newData.val()).exists()`
          },
          updatedAt: {
            '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
          },
          updatedBy: {
            '.validate': `root.child('users/'+newData.val()).exists()`
          },
          connectionRating: {
            '.validate': 'newData.isNumber()'
          },
          $other: { '.validate': false }
        }
      },
      lessons: {
        $lessonsKey: {
          '.validate': `root.child('lessons/meta/'+$lessonsKey).exists()`,
          createdAt: {
            '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
          },
          createdBy: {
            '.validate': `root.child('users/'+newData.val()).exists()`
          },
          updatedAt: {
            '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
          },
          updatedBy: {
            '.validate': `root.child('users/'+newData.val()).exists()`
          },
          $other: { '.validate': false }
        }
      },
      $other: { '.validate': false }
    })
  })

  it('returns the correct rules for a derived resource', () => {
    const rules = generateRelationships('lessons', {
      students: {
        derivedFrom: { resource: 'courses' }
      }
    }, {
      courses: {
        relationships: {
          students: { resource: 'users' },
          lessons: true
        }
      }
    })
    expect(rules).toEqual({
      $other: { '.validate': false },
      students: {
        $studentsKey: {
          '.validate': `root.child('users/'+$studentsKey).exists()`,
          $other: { '.validate': false },
          courses: {
            $coursesKey: {
              '.validate': `(root.child('courses/meta/'+$coursesKey).exists() && root.child('courses/relationships/'+$coursesKey+'/lessons/'+$lessonsKey).exists() && root.child('lessons/relationships/'+$lessonsKey+'/courses/'+$coursesKey).exists())`,
              createdAt: {
                '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
              },
              createdBy: {
                '.validate': `root.child('users/'+newData.val()).exists()`
              },
              updatedAt: {
                '.validate': `(newData.isNumber() && newData.val() % 1 === 0)`
              },
              updatedBy: {
                '.validate': `root.child('users/'+newData.val()).exists()`
              },
              $other: { '.validate': false }
            }
          }
        }
      }
    })
  })
})
