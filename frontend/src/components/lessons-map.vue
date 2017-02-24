<template>
  <div
    ref="container"
    class="lesson-graph-container"
  >
    <svg :width="graph.width" :height="graph.height">
      <path
        v-for="edge in lessonEdges"
        :d="edgePath(edge)"
        :style="{ stroke: langColorDark(edge.toLang) }"
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
      :class="lessonStatus(node.lesson)"
      @mouseenter.native="$emit('lesson-hover', node.lesson)"
      @mouseleave.native="$emit('lesson-hover', null)"
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
          <div v-if="course" class="flex-col">
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
              v-if="lessonStatus(node.lesson).started"
              class="button inline lessons-map-project-status"
              :class="lessonStatus(node.lesson)"
              :href="
                'https://github.com/' +
                currentUser.profile.github.login +
                '/' +
                [
                  course['.key'],
                  node.lesson['.key'],
                  getProjectCompletion(node.lesson).projectKey.slice(-6)
                ].join('-')
              "
              target="_blank"
              @click.stop
            >
              <span v-if="lessonStatus(node.lesson).approved">
                <span class="fa fa-check"/>
                Approved
              </span>
              <span v-else-if="lessonStatus(node.lesson).changesRequested">
                <span class="fa fa-exclamation-circle"/>
                Changes<br>Requested
              </span>
              <span v-else-if="lessonStatus(node.lesson).awaitingFeedback">
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
import { line as d3Line, curveBundle } from 'd3-shape'
import sortBy from 'lodash/sortBy'
import { canUpdateLesson } from '@state/auth/lessons'
import { userGetters } from '@state/helpers'
import design from '@config/design'
import roundedCourseLessonGradePoints from '@helpers/rounded-course-lesson-grade-points'
import courseLessonStatus from '@helpers/course-lesson-status'
import getProjectCompletion from '@helpers/get-project-completion'

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
      gutterWidth,
      nodeWidth: 320,
      nodeHeight: 114,
      nodeMarginHorizontal: gutterWidth * 4,
      nodeMarginVertical: gutterWidth * 1.5,
      hoveredLesson: null
    }
  },
  computed: {
    ...userGetters,
    preSortedLessons () {
      const categoryOrder = [
        'css',
        'html',
        'js'
      ]
      // Presort lessons, so that nodes with more postreqs are
      // calculated first, followed by general groupings by language,
      // so that more difficult to place nodes are given priority,
      // but language groups are still generally placed togetherq
      return sortBy(this.lessons, [
        lesson => this.getExtendedPostreqsCount(lesson),
        lesson => categoryOrder.indexOf(this.lessonLang(lesson))
      ])
    },
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
      this.preSortedLessons.forEach(lesson => {
        const lessonKey = lesson['.key']
        layout.setNode(lessonKey, {
          lesson,
          width: this.nodeWidth,
          height: this.nodeHeight
        })
        const postreqsIncludedInCourse = lesson.postreqKeys.map(postreqKey => {
          return this.lessons.find(lesson => {
            return lesson['.key'] === postreqKey
          })
        }).filter(postreq => postreq)
        // Sort postreqs by their number of immediate prereqs, descending,
        // so that more difficult to place nodes are given priority
        sortBy(
          postreqsIncludedInCourse,
          postreq => -1 * this.getImmediatePrereqsCount(postreq)
        ).forEach(postreq => {
          layout.setEdge(lessonKey, postreq['.key'])
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
      return this.layout.edges().map(nodeKeys => {
        const startNode = this.layout.node(nodeKeys.v)
        const endNode = this.layout.node(nodeKeys.w)
        const startNodeX = this.nodeOffsetX(startNode) + startNode.width
        const endNodeX = this.nodeOffsetX(endNode)
        const horizontalDistance = endNodeX - startNodeX
        const cardWidthWithMargin = this.nodeWidth + this.nodeMarginHorizontal
        const cardHeightWithMargin = this.nodeHeight + this.nodeMarginVertical
        const halfCardHeightWithMargin = cardHeightWithMargin / 2
        const halfNodeMarginHorizontal = this.nodeMarginHorizontal / 2
        const cardsAwayCount = Math.floor(horizontalDistance / cardWidthWithMargin)
        // Pulls the final resting point upwards or downwards
        // on the card, depending on the horizontal and
        // vertical distance from the starting card.
        const yPull = Math.min(
          this.nodeHeight / 2.5,
          this.nodeHeight / 6 *
            (cardsAwayCount + 1) *
            Math.abs(startNode.y - endNode.y) /
            this.nodeHeight
        )
        const startNodeY = startNode.y
        const endNodeY = startNode.y === endNode.y
          ? endNode.y
          : startNode.y > endNode.y
            ? endNode.y + yPull
            : endNode.y - yPull
        const startMidWayX = startNodeX + halfNodeMarginHorizontal
        const startMidWayY = startNodeY < endNodeY
          ? Math.min(endNodeY, startNode.y + halfCardHeightWithMargin)
          : Math.max(endNodeY, startNode.y - halfCardHeightWithMargin)
        const endMidWayX = endNodeX - halfNodeMarginHorizontal
        const points = [
          { x: startNodeX, y: startNodeY },
          { x: startMidWayX, y: startNodeY }
        ]
        if (cardsAwayCount) {
          for (let i = 0; i <= cardsAwayCount; i++) {
            points.push({
              x: startMidWayX + cardWidthWithMargin * i,
              y: startMidWayY
            })
          }
        }
        points.push({ x: endMidWayX, y: endNodeY })
        points.push({ x: endNodeX, y: endNodeY })
        return {
          points,
          cardsAwayCount,
          toLang: this.lessonLang(endNode.lesson)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(this.scrollToRecommendedLessons)
  },
  watch: {
    'course.projectCompletions': 'scrollToRecommendedLessons'
  },
  methods: {
    canUpdateLesson,
    nodeOffsetX (node) {
      return node.x - node.width / 2
    },
    nodeOffsetY (node) {
      return node.y - node.height / 2
    },
    nodeTransform (node) {
      return `translate(${
        this.nodeOffsetX(node) + 'px'
      },${
        this.nodeOffsetY(node) + gutterWidth + 'px'
      })`
    },
    edgePath (edge) {
      const drawPath = d3Line().x(d => d.x).y(d => d.y)
        // https://github.com/d3/d3-shape#curveBundle
        .curve(curveBundle.beta(
          edge.cardsAwayCount > 0 ? 1 : 0.8
        ))
      return drawPath(edge.points)
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
    lessonStatus (lesson) {
      if (!this.course) return {}
      return courseLessonStatus(this.course, lesson)
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
    langColorDark (lang) {
      return {
        html: '#bf8f8f',
        css: '#8ba0b1',
        js: '#b5a53c'
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
    },
    getProjectCompletion (lesson) {
      return getProjectCompletion(this.course, lesson)
    },
    getExtendedPostreqsCount (lesson) {
      const immediatePostreqs = lesson.postreqKeys.map(postreqKey => {
        return this.lessons.find(lesson => lesson['.key'] === postreqKey)
      }).filter(postreq => postreq)
      return (
        immediatePostreqs.length +
        immediatePostreqs
          .map(postreq => this.getExtendedPostreqsCount(postreq))
          .reduce((a, b) => a + b, 0)
      )
    },
    getImmediatePrereqsCount (lesson) {
      return lesson.prereqKeys.filter(prereqKey => {
        return this.lessons.some(lesson => lesson['.key'] === prereqKey)
      }).length
    },
    scrollToRecommendedLessons () {
      const recommendedLessonsOffsets = this.lessonNodes
        .filter(node => this.lessonStatus(node.lesson).recommended)
        .map(node => this.nodeOffsetX(node))
      const minRecommendedOffset = Math.min(...recommendedLessonsOffsets)
      this.$refs.container.scrollLeft = minRecommendedOffset
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
  padding: $design.layout.gutterWidth

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
  &.recommended
    opacity: 1
    box-shadow: 0 0 20px 5px rgba($design.branding.primary.light, .2)
  &:hover
    border-color: $design.branding.primary.light
    height: auto !important
    opacity: 1
    z-index: 1
    > h3
      white-space: normal

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
  top: -1px
  right: -1px
  border-top: none
  border-right: none
  border-top-left-radius: 0
  border-top-right-radius: $design.control.border.radius
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
  stroke-width: 2px
  fill: transparent
  pointer-events: none
</style>
