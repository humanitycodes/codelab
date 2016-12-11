import singularize from '../utils/singularize'
import capitalize from '../utils/capitalize'

export default ({
  resourceItem,
  resourceName, resourceKey, resourceDefs,
  state, stateDefs,
  uid,
  db
}) => {
  // Define relationships as read-only
  const relationships = resourceDefs[resourceName].relationships || {}
  const relationshipNames = Object.keys(relationships)
  relationshipNames.forEach(relationshipName => {
    const relationshipDef = typeof relationships[relationshipName] === 'object'
      ? relationships[relationshipName]
      : {}
    Object.defineProperty(
      resourceItem,
      `${singularize(relationshipName)}Keys`,
      {
        value: Object.keys(
          (
            stateDefs[resourceKey].relationships &&
            stateDefs[resourceKey].relationships[relationshipName]
          ) || {}
        ),
        enumerable: true
      }
    )
    // !!! Abort (don't create add/remove relationship methods) if the course is derived
    if (relationshipDef.derivedFrom) return

    const relatedResourceName = relationshipDef.resource
      ? relationshipDef.resource
      : relationshipName
    const resourceForeignKey = relationshipDef.foreignKey
      ? relationshipDef.foreignKey
      : resourceName
    // Scan all resources for values derived from this relationship
    const updatesToTrigger = []
    for (const otherResourceName in resourceDefs) {
      // Abort immediately if the resource is self, because there
      // will never be a need to derive a relationship from another
      // relationship on the same resource
      if (otherResourceName === resourceName) return
      const otherResourceRelationships = resourceDefs[otherResourceName].relationships
      const otherResourceRelationshipNames = Object.keys(otherResourceRelationships)
      otherResourceRelationshipNames.forEach(otherRelationshipName => {
        const otherRelationshipDef = typeof otherResourceRelationships[otherRelationshipName] === 'object'
          ? otherResourceRelationships[otherRelationshipName]
          : {}
        if (otherRelationshipDef.derivedFrom) {
          const derivedDef = otherRelationshipDef.derivedFrom
          const originResource = derivedDef.resource
          const originRelationship = derivedDef.relationship || otherRelationshipName
          const dependentForeignKey = derivedDef.foreignKey || otherResourceName
          // E.g. If we're building relationships for courses and
          // find this when scanning lessons:
          //     lessons: {
          //       relationships: {
          //         students: {
          //           derivedFrom: { resource: 'courses' }
          //         }
          //       }
          //     }
          // Then the resource name "courses" will match our own
          if (originResource === resourceName) {
            // e.g. When building course "students" relationship...
            if (originRelationship === relationshipName) {
              updatesToTrigger.push({
                type: 'SELF_TO_MANY',
                sourceRelationship: dependentForeignKey,  // e.g. "lessons"
                targetResource: otherResourceName,        // e.g. "lessons"
                targetRelationship: otherRelationshipName // e.g. "students"
              })
            }
            // e.g. When building course "lessons" relationship...
            if (dependentForeignKey === relationshipName) {
              updatesToTrigger.push({
                type: 'MANY_TO_SELF',
                sourceRelationship: originRelationship,   // e.g. "students"
                targetRelationship: otherRelationshipName // e.g. "students"
              })
            }
          }
        }
      })
    }

    const singularRelatedResourceName = singularize(relationshipName)
    const addRelatedResourceName = 'add' + capitalize(singularRelatedResourceName)
    // Define "add" method for the relationship
    // E.g. course.addLesson(lessonKey)
    resourceItem[addRelatedResourceName] = function (relatedResourceKey) {
      const firebaseActions = []
      // Add relationship with meta keys to current record
      firebaseActions.push(
        db.ref(`${resourceName}/relationships`)
          .child(resourceKey)
          .child(relationshipName)
          .child(relatedResourceKey)
          .child('createdAt')
          .set(Date.now())
      )
      firebaseActions.push(
        db.ref(`${resourceName}/relationships`)
          .child(resourceKey)
          .child(relationshipName)
          .child(relatedResourceKey)
          .child('createdBy')
          .set(uid)
      )
      // If the resource is listed in defs/resources, add
      // the relationship there as well to create a two-way
      // relationship (i.e. many-to-many)
      // E.g. When you add a lesson to a course, you are
      // also adding that course to the lesson
      if (resourceDefs[relatedResourceName]) {
        firebaseActions.push(
          db.ref(`${relatedResourceName}/relationships`)
            .child(relatedResourceKey)
            .child(resourceForeignKey)
            .child(resourceKey)
            .child('createdAt')
            .set(Date.now())
        )
        firebaseActions.push(
          db.ref(`${relatedResourceName}/relationships`)
            .child(relatedResourceKey)
            .child(resourceForeignKey)
            .child(resourceKey)
            .child('createdBy')
            .set(uid)
        )
      }
      return Promise.all(firebaseActions).then(() => {
        return updatesToTrigger.map(updateDef => {
          const sourceRelationshipKeys = Object.keys(
            stateDefs[resourceKey].relationships[updateDef.sourceRelationship]
          )
          if (updateDef.type === 'SELF_TO_MANY') {
            return Promise.all(
              sourceRelationshipKeys.map(sourceRelationshipKey => {
                return Promise.all([
                  db.ref(updateDef.targetResource + '/relationships')
                    .child(sourceRelationshipKey)
                    .child(updateDef.targetRelationship)
                    .child(relatedResourceKey)
                    .child(resourceName)
                    .child(resourceKey)
                    .child('createdAt')
                    .set(Date.now()),
                  db.ref(updateDef.targetResource + '/relationships')
                    .child(sourceRelationshipKey)
                    .child(updateDef.targetRelationship)
                    .child(relatedResourceKey)
                    .child(resourceName)
                    .child(resourceKey)
                    .child('createdBy')
                    .set(uid)
                ])
              })
            )
          } else if (updateDef.type === 'MANY_TO_SELF') {
            return Promise.all(
              sourceRelationshipKeys.map(sourceRelationshipKey => {
                return Promise.all([
                  db.ref(relatedResourceName + '/relationships')
                    .child(relatedResourceKey)
                    .child(updateDef.targetRelationship)
                    .child(sourceRelationshipKey)
                    .child(resourceName)
                    .child(resourceKey)
                    .child('createdAt')
                    .set(Date.now()),
                  db.ref(relatedResourceName + '/relationships')
                    .child(relatedResourceKey)
                    .child(updateDef.targetRelationship)
                    .child(sourceRelationshipKey)
                    .child(resourceName)
                    .child(resourceKey)
                    .child('createdBy')
                    .set(uid)
                ])
              })
            )
          } else {
            throw new Error(`Bad relationship update trigger type: ${updateDef.type}. Acceptable values are "SELF_TO_MANY" and "MANY_TO_SELF".`)
          }
        })
      })
    }
    // Define "remove" method for the relationship
    // E.g. course.removeLesson(lessonKey)
    const removeRelatedResourceName = 'remove' + capitalize(singularRelatedResourceName)
    resourceItem[removeRelatedResourceName] = function (relatedResourceKey) {
      const firebaseActions = []
      // Remove relationship from the current record
      firebaseActions.push(
        db.ref(`${resourceName}/relationships`)
          .child(resourceKey)
          .child(relationshipName)
          .child(relatedResourceKey)
          .remove()
      )
      // If the resource is listed in defs/resources, remove
      // the relationship there as well to end a two-way
      // relationship (i.e. many-to-many)
      // E.g. When you remove a lesson from a course, you are
      // also removing that course from the lesson
      if (resourceDefs[relatedResourceName]) {
        firebaseActions.push(
          db.ref(`${relatedResourceName}/relationships`)
            .child(relatedResourceKey)
            .child(resourceForeignKey)
            .child(resourceKey)
            .remove()
        )
      }
      return Promise.all(firebaseActions).then(() => {
        return updatesToTrigger.map(updateDef => {
          const sourceRelationshipKeys = Object.keys(
            state[`raw-${resourceName}`][resourceKey]
              .relationships[updateDef.sourceRelationship]
          )
          if (updateDef.type === 'SELF_TO_MANY') {
            return Promise.all(
              sourceRelationshipKeys.map(sourceRelationshipKey => {
                return db.ref(updateDef.targetResource + '/relationships')
                  .child(sourceRelationshipKey)
                  .child(updateDef.targetRelationship)
                  .child(relatedResourceKey)
                  .child(resourceName)
                  .child(resourceKey)
                  .remove()
              })
            )
          } else if (updateDef.type === 'MANY_TO_SELF') {
            return Promise.all(
              sourceRelationshipKeys.map(sourceRelationshipKey => {
                return db.ref(relatedResourceName + '/relationships')
                  .child(relatedResourceKey)
                  .child(updateDef.targetRelationship)
                  .child(sourceRelationshipKey)
                  .child(resourceName)
                  .child(resourceKey)
                  .remove()
              })
            )
          } else {
            throw new Error(`Bad relationship update trigger type: ${updateDef.type}. Acceptable values are "SELF_TO_MANY" and "MANY_TO_SELF".`)
          }
        })
      })
    }
  })
}
