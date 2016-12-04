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
          '.validate': `(root.child('courses/'+$coursePrereqsKey).exists() && $coursePrereqsKey !== $coursesKey)`,
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
          '.validate': `root.child('lessons/'+$lessonsKey).exists()`,
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
})
