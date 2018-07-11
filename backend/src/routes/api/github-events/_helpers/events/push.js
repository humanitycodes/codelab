import sequelize from 'db/sequelize'
import readProjectCompletionRecordForFullRepoName from '../read-project-completion-record-for-full-repo-name'
import updateProjectCompletionRecord from 'db/project-completion/update'

// SAMPLE REQUEST:
// {
//   method: "POST",
//   headers: {
//     "x-github-event": "push",
//     "x-github-delivery": "some random event id"
//   },
//   payload: {
//     "repository": {
//       "full_name": "egillespie/MI-222-css-intro"
//     },
//     "commits": [{
//       "timestamp": "2018-07-10T15:10:27-04:00"
//     }]
//   }
// }
export default async pushEvent => {
  // Make sure there was at least one commit
  if (!pushEvent.commits.length) return

  let transaction
  try {
    transaction = await sequelize.transaction()

    const projectCompletionRecord =
      await readProjectCompletionRecordForFullRepoName(
        pushEvent.repository.full_name, { transaction }
      )

    // Set committed to true
    if (!projectCompletionRecord.committed) {
      const pushTimestamp = new Date(pushEvent.commits[0].timestamp).getTime()
      projectCompletionRecord.committed = true
      projectCompletionRecord.firstCommittedAt = pushTimestamp
      await updateProjectCompletionRecord(
        projectCompletionRecord, { transaction }
      )
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
