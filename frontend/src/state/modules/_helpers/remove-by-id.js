export default (idField, entities, idsToRemove) => entities.filter(
  entity => !idsToRemove.includes(entity[idField])
)
