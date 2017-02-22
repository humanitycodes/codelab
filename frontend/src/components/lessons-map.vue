<template>
  <div
    ref="container"
    class="lesson-graph-container"
  >
    <svg :width="graph.width" :height="graph.height">
      <path
        v-for="edge in lessonEdges"
        :d="edgePath(edge)"
      />
    </svg>
    <router-link
      v-for="node in lessonNodes"
      :style="{
        transform: nodeTransform(node),
        width: nodeWidth + 'px',
        height: nodeHeight + 'px',
        minHeight: nodeHeight + 'px'
      }"
      :to="nodeClickPath(node.lesson)"
      class="lesson-graph-card container-link"
      :class="{ recommended: isLessonRecommended(node.lesson) }"
    >
      <router-link
        v-if="course && canUpdateLesson({ lessonKey: node.lesson['.key'] })"
        class="button inline primary lessons-map-corner-action-lesson-button"
        :to="editLessonPath(node.lesson)"
      >Edit</router-link>
      <h3>{{ node.lesson.title }}</h3>
      <div class="lesson-graph-card-details">
        <div class="flex-row lesson-graph-card-metadata">
          <div
            v-html="lessonLangTag(node.lesson)"
            class="flex-col"
          />
          <div class="flex-col">
            <span class="fa fa-clock-o"/>
            {{ node.lesson.estimatedHours }}
          </div>
          <div class="flex-col">
            <span class="fa fa-graduation-cap"/>
            {{ lessonGradePoints(node.lesson) }}
          </div>
          <div class="flex-col" v-if="node.lesson.categories && node.lesson.categories.length">
            <ul v-for="category in node.lesson.categories">
              <li>{{ category.title }}</li>
            </ul>
          </div>
          <div class="flex-col">
            <a
              v-if="findProjectCompletion(node.lesson)"
              class="button inline lessons-map-project-status"
              :class="{
                approved: isLessonProjectApproved(node.lesson),
                'changes-requested': isLessonProjectAwaitingRequestedChanges(node.lesson),
                'awaiting-feedback': isLessonProjectAwaitingFeedback(node.lesson)
              }"
              :href="
                'https://github.com/' +
                currentUser.profile.github.login +
                '/' +
                [
                  course['.key'],
                  node.lesson['.key'],
                  findProjectCompletion(node.lesson).projectKey.slice(-6)
                ].join('-')
              "
              target="_blank"
              @click.stop
            >
              <span v-if="isLessonProjectApproved(node.lesson)">
                <span class="fa fa-check"/>
                Approved
              </span>
              <span v-else-if="isLessonProjectAwaitingRequestedChanges(node.lesson)">
                <span class="fa fa-exclamation-circle"/>
                Changes<br>Requested
              </span>
              <span v-else-if="isLessonProjectAwaitingFeedback(node.lesson)">
                Awaiting<br>Feedback
              </span>
              <span v-else>
                In Progress
              </span>
            </a>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import Dagre from 'dagre'
import { path as D3Path } from 'd3-path'
import { canUpdateLesson } from '@state/auth/lessons'
import { userGetters } from '@state/helpers'
import design from '@config/design'
import roundedCourseLessonGradePoints from '@helpers/rounded-course-lesson-grade-points'

const gutterWidth = parseInt(design.layout.gutterWidth)

export default {
  props: {
    lessons: {
      type: Array,
      required: true
    },
    course: Object
  },
  data () {
    return {
      nodeWidth: 320,
      nodeHeight: 114,
      nodeMarginHorizontal: gutterWidth * 3,
      nodeMarginVertical: gutterWidth
    }
  },
  computed: {
    ...userGetters,
    layout () {
      const layout = new Dagre.graphlib.Graph()
      // Layout options
      // https://github.com/cpettitt/dagre/wiki#configuring-the-layout
      layout.setGraph({
        // The direction of the tree (e.g. LR means
        // left-to-right)
        rankDir: 'LR',
        // Number of pixels that separate nodes horizontally
        // in the layout
        nodesep: this.nodeMarginVertical,
        ranksep: this.nodeMarginHorizontal
      })
      // Set default object for edge labels,
      // otherwise we can't assign points
      layout.setDefaultEdgeLabel(() => ({}))
      // For each lesson, register the nodes and edges
      // of the directive acyclic graph
      this.lessons.forEach(lesson => {
        const lessonKey = lesson['.key']
        layout.setNode(lessonKey, {
          lesson,
          width: this.nodeWidth,
          height: this.nodeHeight
        })
        lesson.prereqKeys.forEach(prereqKey => {
          // If the prereq is actually part of this lessons list
          const prereqInLessons = this.lessons.some(includedLesson => {
            return includedLesson['.key'] === prereqKey
          })
          if (prereqInLessons) {
            layout.setEdge(prereqKey, lessonKey)
          }
        })
      })
      // Calculate the layout, adding "x" and "y" to
      // nodes and a "points" array to edges
      Dagre.layout(layout)
      return layout
    },
    graph () {
      return this.layout.graph()
    },
    lessonNodes () {
      return this.layout.nodes().map(nodeKey => {
        return this.layout.node(nodeKey)
      })
    },
    lessonEdges () {
      return this.layout.edges().map(edgeKeys => {
        return this.layout.edge(edgeKeys)
      })
    }
  },
  mounted () {
    const recommendedLessonsOffsets = this.lessonNodes
      .filter(node => this.isLessonRecommended(node.lesson))
      .map(node => node.x + this.nodeMarginHorizontal + this.nodeWidth / 2)
    this.$nextTick(() => {
      this.$refs.container.scrollLeft = Math.min(...recommendedLessonsOffsets)
    })
  },
  methods: {
    canUpdateLesson,
    nodeOffsetX (node) {
      return node.x - this.nodeWidth / 2
    },
    nodeOffsetY (node) {
      return node.y - this.nodeHeight / 2
    },
    nodeTransform (node) {
      return `translate(${
        this.nodeOffsetX(node) + 'px'
      },${
        this.nodeOffsetY(node) + 'px'
      })`
    },
    edgePath (edge) {
      const path = D3Path()
      const [ startingPoint, ...points ] = edge.points
      path.moveTo(startingPoint.x, startingPoint.y)
      let i
      for (i = 0; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        path.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }
      path.quadraticCurveTo(
        points[i].x, points[i].y,
        points[i + 1].x, points[i + 1].y
      )
      return path.toString()
    },
    nodeClickPath (lesson) {
      return this.course
        ? this.showCourseLessonPath(lesson)
        : this.editLessonPath(lesson)
    },
    showCourseLessonPath (lesson) {
      return '/courses/' + this.course['.key'] + '/lessons/' + lesson['.key']
    },
    editLessonPath (lesson) {
      return '/lessons/' + lesson['.key'] + '/edit'
    },
    findProjectCompletion (lesson) {
      if (!this.course || !this.course.projectCompletions) return null
      const rawProjectCompletion = this.course.projectCompletions.find(completion => {
        return (
          completion.students.some(student => {
            return student['.key'] === this.currentUser.uid
          }) &&
          completion.lessonKey === lesson['.key']
        )
      })
      if (rawProjectCompletion) {
        const projectCompletion = { ...rawProjectCompletion }
        projectCompletion.studentKey = projectCompletion.students[0]['.key']
        delete projectCompletion.students
        return projectCompletion
      }
    },
    isLessonProjectApproved (lesson) {
      const projectCompletion = this.findProjectCompletion(lesson)
      return (
        projectCompletion &&
        projectCompletion.submission &&
        projectCompletion.submission.isApproved
      )
    },
    isLessonProjectAwaitingRequestedChanges (lesson) {
      const projectCompletion = this.findProjectCompletion(lesson)
      return (
        projectCompletion &&
        projectCompletion.submission &&
        !projectCompletion.submission.isApproved &&
        projectCompletion.submission.instructorCommentedLast
      )
    },
    isLessonProjectAwaitingFeedback (lesson) {
      const projectCompletion = this.findProjectCompletion(lesson)
      return (
        projectCompletion &&
        projectCompletion.submission &&
        !projectCompletion.submission.isApproved &&
        !projectCompletion.submission.instructorCommentedLast
      )
    },
    isLessonRecommended (lesson) {
      const projectCompletion = this.findProjectCompletion(lesson)
      return (
        // Project is not approved for this lesson
        (
          !projectCompletion ||
          !projectCompletion.submission ||
          !projectCompletion.submission.isApproved
        ) && (
          // Lesson does not have any prereqs
          !lesson.prereqKeys.length ||
          // Projects for prereqs are all approved
          lesson.prereqKeys
            .map(prereqKey => {
              return this.lessons.find(potentialPrereq => {
                return potentialPrereq['.key'] === prereqKey
              })
            })
            .filter(prereq => prereq)
            .every(prereq => {
              const prereqProjectCompletion = this.findProjectCompletion(prereq)
              return (
                prereqProjectCompletion &&
                prereqProjectCompletion.submission &&
                prereqProjectCompletion.submission.isApproved
              )
            })
        )
      )
    },
    lessonLang (lesson) {
      return lesson['.key'].match(/^(\w+?)-/)[1]
    },
    langColor (lang) {
      return {
        html: '#ffc5c5',
        css: '#d5e2ec',
        js: '#f3e9a6'
      }[lang]
    },
    lessonLangTag (lesson) {
      const lang = this.lessonLang(lesson)
      const color = this.langColor(lang)
      return `
        <span class="lesson-lang-tag ${lang}" style="background:${color}">
          ${lang.toUpperCase()}
        </span>
      `
    },
    lessonGradePoints (lesson) {
      return roundedCourseLessonGradePoints(this.course, lesson)
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

.lesson-lang-tag.lesson-lang-tag
  margin-top: -2px
  padding: $design.layout.gutterWidth * .1 $design.layout.gutterWidth * .25
  border-radius: $design.control.border.radius
  letter-spacing: 1px
  font-size: .9em
</style>

<style lang="stylus" scoped>
@import '../meta'

.lesson-graph-container
  position: relative
  padding-bottom: 16px
  overflow-x: auto

.lesson-graph-card
  display: flex
  flex-direction: column
  position: absolute
  top: 0
  padding: $design.layout.gutterWidth
  background-color: $design.branding.default.light
  border: 1px solid $design.control.border.color
  border-radius: $design.control.border.radius
  opacity: .7
  transition: all .3s
  > h3
    margin-top: 0
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden
  &:hover
    border-color: $design.branding.primary.light
    height: auto !important
    opacity: 1
    z-index: 1
    > h3
      white-space: normal
  &.recommended
    opacity: 1

.lesson-graph-card-details
  > .flex-row
    &:first-child
      margin-top: 0
    &:last-child
      margin-bottom: 0
    > .flex-col
      &:last-child
        text-align: right

.lesson-graph-card-metadata > .flex-col
  position: relative
  overflow: visible
  font-family: Lato
  white-space: nowrap
  margin-left: 0
  flex-shrink: 999
  &:last-child
    flex-shrink: 1

.lessons-map-corner-action-lesson-button
  position: absolute
  top: 0
  right: 0
  border-top: none
  border-right: none
  border-top-left-radius: 0
  border-top-right-radius: 0
  border-bottom-right-radius: 0
  margin-top: 0

.lessons-map-project-status
  display: inline-block
  padding: 4px 6px
  line-height: 1.5
  letter-spacing: 1px
  position: absolute
  right: 0
  bottom: 0
  background-color: $design.branding.muted.light.tan
  &.approved
    background-color: $design.branding.muted.light.success
  &.changes-requested
    background-color: $design.branding.muted.light.yellow
    bottom: -5px
  &.awaiting-feedback
    bottom: -5px

path
  stroke: $design.branding.primary.light
  stroke-width: 2px
  fill: transparent
  pointer-events: none
</style>
