import boom from 'boom'
import parseIdentifiersFromFullRepoName from 'helpers/github/parse-identifiers-from-full-repo-name'
import readUserRecordByGitHubLogin from 'db/user/read-by-github-login'
import readActiveCourseRecordsForPartialKeyAndStudentId from 'db/course/read-all-active-for-partial-key-and-student-id'
import readLessonRecordByKey from 'db/lesson/read-by-key'
import readProjectCompletionRecordByCourseLessonStudentIds from 'db/project-completion/read-by-course-lesson-student-ids'

export default async (fullRepoName, { transaction }) => {
  // Figure out the owner, course, lesson, and project from the repo
  const identifiers = parseIdentifiersFromFullRepoName(fullRepoName)
  if (!identifiers) {
    throw boom.badData('fullRepoName.unparseable', fullRepoName)
  }

  const { githubLogin, lessonKey } = identifiers
  const partialCourseKey = identifiers.partialCourseKey || identifiers.courseKey

  // Get the associated student
  const userRecord = await readUserRecordByGitHubLogin(
    githubLogin, { transaction }
  )
  if (!userRecord) {
    throw boom.badData('user.missing', { githubLogin })
  }

  // Get the associated course
  const courseRecords = await readActiveCourseRecordsForPartialKeyAndStudentId(
    { partialCourseKey, studentUserId: userRecord.userId }, { transaction }
  )
  if (!courseRecords || !courseRecords.length) {
    throw boom.badData(
      'course.missing',
      { partialCourseKey, studentUserId: userRecord.userId }
    )
  } else if (courseRecords.length > 1) {
    throw boom.badData(
      'course.tooMany',
      { partialCourseKey, studentUserId: userRecord.userId }
    )
  }
  const courseRecord = courseRecords[0]

  // Get the associated lesson
  const lessonRecord = await readLessonRecordByKey(
    lessonKey, { transaction }
  )
  if (!lessonRecord) {
    throw boom.badData('lesson.missing', { lessonKey })
  }

  // Find matching project completion
  const projectCompletionSearchCriteria = {
    courseId: courseRecord.courseId,
    lessonId: lessonRecord.lessonId,
    studentUserId: userRecord.userId
  }
  const projectCompletionRecord =
    await readProjectCompletionRecordByCourseLessonStudentIds(
      projectCompletionSearchCriteria,
      { transaction }
    )
  if (!projectCompletionRecord) {
    throw boom.notFound(
      'projectCompletion.missing',
      projectCompletionSearchCriteria
    )
  }

  return projectCompletionRecord
}
