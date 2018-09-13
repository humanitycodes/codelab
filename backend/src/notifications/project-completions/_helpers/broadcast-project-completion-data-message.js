import translateProjectCompletionFromRecord from 'translators/project-completion/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'

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

  const data = {
    action,
    resourceType: 'project-completion',
    resource: projectCompletion
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
