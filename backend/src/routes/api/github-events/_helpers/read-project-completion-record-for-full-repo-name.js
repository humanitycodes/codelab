import boom from 'boom'
import parseIdentifiersFromFullRepoName from 'helpers/github/parse-identifiers-from-full-repo-name'
import readUserRecordByGitHubLogin from 'db/user/read-by-github-login'
import readCourseRecordByPartialKeyAndStudentId from 'db/course/read-by-partial-key-and-student-id'
import readLessonRecordByKey from 'db/lesson/read-by-key'
import readProjectCompletionRecordByCourseLessonStudentIds from 'db/project-completion/read-by-course-lesson-student-ids'

// fullRepoName: egillespie/MI-654-css-intro
export default async (fullRepoName, { transaction }) => {
  // Figure out the owner, course, lesson, and project from the repo
  const identifiers = parseIdentifiersFromFullRepoName(fullRepoName)
  if (!identifiers) {
    throw boom.badData('fullRepoName.unparseable', fullRepoName)
  }
  const { githubLogin, partialCourseKey, lessonKey } = identifiers

  // Get the associated student
  const userRecord = await readUserRecordByGitHubLogin(
    githubLogin, { transaction }
  )
  if (!userRecord) {
    throw boom.badData('user.missing', { githubLogin })
  }

  // Get the associated course
  const courseRecord = await readCourseRecordByPartialKeyAndStudentId(
    { partialCourseKey, studentUserId: userRecord.userId }, { transaction }
  )
  if (!courseRecord) {
    throw boom.badData(
      'course.missing',
      { partialCourseKey, studentUserId: userRecord.userId }
    )
  }

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
