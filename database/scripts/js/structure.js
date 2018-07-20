const structure =
{
  courses: {
    fieldGroups: {
      small: {
        authed: {
          [courseKey]: {
            credits: 'number',
            title: 'string',
            startDate: 'timestamp',
            endDate: 'timestamp'
          }
        },
        instructor: {
          [courseKey]: {
            preenrollments: {
              [uriEncodedEmail]: {
                position: 'number'
              }
            }
          }
        }
      },
      large: {
        authed: {
          [courseKey]: {
            syllabus: 'string'
          }
        },
        student: {
          [courseKey]: {
            projectCompletions: {
              // [completionKey] = [projectKey]-[userKey]
              [completionKey]: {
                committed: 'boolean',
                lessonKey: [lessonKey],
                position: 'number',
                projectKey: [projectKey],
                students: {
                  [userKey]: {
                    position: 'number'
                  }
                },
                submission: {
                  assignedInstructor: [userKey],
                  firstSubmittedAt: 'timestamp',
                  instructorCommentedLast: 'boolean',
                  isApproved: 'boolean',
                  lastCommentedAt: 'timestamp'
                }
              }
            }
          }
        }
      }
    },
    meta: {
      [courseKey]: {
        createdAt: 'timestamp',
        createdBy: [userKey],
        updatedAt: 'timestamp',
        updatedBy: [userKey]
      }
    },
    relationships: {
      [courseKey]: {
        instructors: {
          [userKey]: {
            createdAt: 'timestamp',
            createdBy: [userKey]
          }
        },
        lessons: {
          [lessonKey]: {
            createdAt: 'timestamp',
            createdBy: [userKey]
          }
        },
        students: {
          [userKey]: {
            createdAt: 'timestamp',
            createdBy: [userKey]
          }
        }
      }
    }
  },
  lessons: {
    fieldGroups: {
      small: {
        student: {
          [lessonKey]: {
            estimatedHours: 'number',
            title: 'string',
            learningObjectives: {
              [objectiveKey]: {
                content: 'string',
                position: 'number'
              }
            }
          }
        }
      },
      large: {
        instructor: {
          [lessonKey]: {
            notes: 'string'
          }
        },
        student: {
          [lessonKey]: {
            content: 'string',
            projects: {
              [projectKey]: {
                hosting: 'string',
                position: 'number',
                title: 'string',
                criteria: {
                  [criteriaKey]: {
                    content: 'string',
                    position: 'number'
                  }
                }
              }
            }
          }
        }
      }
    },
    meta: {
      [lessonKey]: {
        createdAt: 'timestamp',
        createdBy: [userKey],
        updatedAt: 'timestamp',
        updatedBy: [userKey]
      }
    },
    relationships: {
      [lessonKey]: {
        courses: {
          [courseKey]: {
            createdAt: 'timestamp',
            createdBy: [userKey]
          }
        },
        postreqs: {
          [lessonKey]: {
            createdAt: 'timestamp',
            createdBy: [userKey]
          }
        },
        prereqs: {
          [lessonKey]: {
            createdAt: 'timestamp',
            createdBy: [userKey]
          }
        },
        students: {
          [userKey]: {
            courses: {
              [courseKey]: {
                createdAt: 'timestamp',
                createdBy: [userKey]
              }
            }
          }
        }
      }
    }
  },
  roles: {
    [userKey]: {
      instructor: 'boolean'
    }
  },
  users: {
    [userKey]: {
      email: 'string',
      fullName: 'string',
      msuUid: 'string',
      github: {
        login: 'string',
        scope: 'string',
        token: 'string',
        tokenType: 'string',
        userId: 'number'
      }
    }
  }
}
