import translateProjectCompletionFromRecord from 'translators/project-completion/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'
import isStringTooBigToBroadcast from 'notifications/_helpers/is-string-too-big-to-broadcast'

export default async ({
  action,
  projectCompletionRecord,
  recipientUserRecords
}) => {
  const projectCompletion = action === 'deleted'
    ? projectCompletionRecord
    : await translateProjectCompletionFromRecord({
      projectCompletionRecord
    })

  const data = { action, resourceType: 'project-completion' }
  const projectCompletionJson = JSON.stringify(projectCompletion)
  if (isStringTooBigToBroadcast(projectCompletionJson)) {
    data.resourceId = projectCompletion.projectCompletionId.toString()
  } else {
    data.resource = projectCompletionJson
  }

  return Promise.all(
    recipientUserRecords.map(async userRecord =>
      broadcastDataToUser({
        userId: userRecord.userId,
        data
      })
    )
  )
}
