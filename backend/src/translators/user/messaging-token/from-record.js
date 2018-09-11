export default ({ userMessagingTokenRecord }) => {
  // Whitelist of fields that are available to clients
  const userMessagingToken = {
    userMessagingTokenId: userMessagingTokenRecord.userMessagingTokenId,
    userId: userMessagingTokenRecord.userId,
    messagingToken: userMessagingTokenRecord.messagingToken,
    version: userMessagingTokenRecord.version
  }

  return userMessagingToken
}
