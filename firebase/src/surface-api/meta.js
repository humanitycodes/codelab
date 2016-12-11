export default ({
  resourceItem,
  resourceKey,
  stateDefs
}) => {
  // Define the meta fields as read-only
  const metaStateDefs = stateDefs[resourceKey].meta || {}
  for (const metaField in metaStateDefs) {
    Object.defineProperty(resourceItem, '.' + metaField, {
      value: metaStateDefs[metaField]
    })
  }
}
