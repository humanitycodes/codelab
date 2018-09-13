import broadcastProjectCompletionDataMessage from './_helpers/broadcast-project-completion-data-message'

export default async ({ projectCompletionRecord, recipientUserRecords }) =>
  broadcastProjectCompletionDataMessage({
    action: 'created',
    projectCompletionRecord,
    recipientUserRecords
  })
