<template>
  <div
    ref="container"
    class="lesson-graph-container"
  >
    <svg :width="graph.width" :height="graph.height">
      <path
        v-for="(edge, index) in lessonEdges"
        :key="index"
        :d="edgePath(edge)"
        :style="{ stroke: langColorDark(edge.toLang) }"
        :class="Object.assign({}, edge.endNode.lessonStatus, {
          'postreq-selected': edgeHasSelectedPostreq(edge),
          'other-is-selected': (
            hoveredLesson &&
            hoveredLesson.lessonId !== edge.endNode.lesson.lessonId
          )
        })"
        class="lesson-graph-edge"
      />
    </svg>
    <router-link
      v-for="(node, index) in lessonNodes"
      :key="index"
      :style="{
        transform: nodeTransform(node),
        width: nodeWidth + 'px',
        height: nodeHeight + 'px',
        minHeight: nodeHeight + 'px'
      }"
      :to="nodeClickPath(node.lesson)"
      @mouseenter.native="startNodeHover(node)"
      @mouseleave.native="endNodeHover(node)"
      :class="Object.assign({}, node.lessonStatus, {
        selected: (
          hoveredLesson &&
          hoveredLesson.lessonId === node.lesson.lessonId
        ),
        'other-is-selected': (
          hoveredLesson &&
          hoveredLesson.lessonId !== node.lesson.lessonId
        ),
        ['lang-' + lessonLang(node.lesson)]: true,
        'postreq-selected': nodeHasSelectedPostreq(node)
      })"
      class="lesson-graph-card container-link"
    >
      <router-link
        v-if="course && canUpdateLesson({ lessonKey: node.lesson.lessonKey })"
        class="button inline primary lessons-map-corner-action-lesson-button"
        :to="editLessonPath(node.lesson)"
      >Edit</router-link>
      <h3>{{ node.lesson.title }}</h3>
      <div class="lesson-graph-card-details">
        <div class="stretch-row lesson-graph-card-metadata">
          <div
            v-html="lessonLangTag(node.lesson)"
            class="stretch-col"
          />
          <div class="stretch-col">
            <span class="far fa-clock-o"/>
            {{ node.lesson.estimatedHours }}
          </div>
          <div v-if="course" class="stretch-col">
            <span class="fas fa-graduation-cap"/>
            {{ lessonGradePoints(node.lesson) }}
          </div>
          <div class="stretch-col" v-if="node.lesson.categories && node.lesson.categories.length">
            <ul
              v-for="category in node.lesson.categories"
              :key="category"
            >
              <li>{{ category.title }}</li>
            </ul>
          </div>
          <div class="stretch-col">
            <a
              v-if="node.lessonStatus.started"
              class="button inline lessons-map-project-status"
              :class="node.lessonStatus"
              :href="userCourseLessonProjectRepoUrl(currentUser, course, node.lesson)"
              target="_blank"
              @click.stop
            >
              <span v-if="node.lessonStatus.approved">
                <span class="fas fa-check"/>
                Approved
              </span>
              <span v-else-if="node.lessonStatus.changesRequested">
                <span class="fas fa-exclamation-circle"/>
                Changes<br>Requested
              </span>
              <span v-else-if="node.lessonStatus.awaitingFeedback">
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
import courseLessonGradePointsRounded from '@helpers/computed/course-lesson-grade-points-rounded'
import courseLessonUserStatus from '@helpers/computed/course-lesson-user-status'
import courseLessonUserProjectCompletion from '@helpers/finders/course-lesson-user-project-completion'
import userCourseLessonProjectRepoUrl from '@helpers/computed/user-course-lesson-project-repo-url'
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
      nodeMarginVertical: gutterWidth,
      hoveredLesson: null,
      hoverTimeout: null
    }
  },
  computed: {
    ...userGetters,
    preSortedLessons () {
      const categoryOrder = [
        'css',
        'html',
        'js',
        'sql'
      ]
      // Presort lessons, so that nodes with more postreqs are
      // calculated first, followed by general groupings by language,
      // so that more difficult to place nodes are given priority,
      // but language groups are still generally placed togetherq
      return sortBy(this.lessons, [
        lesson => this.getExtendedPostreqs(lesson).length,
        lesson => categoryOrder.indexOf(this.lessonLang(lesson))
      ])
    },
    layout () {
      const layout = new Dagre.graphlib.Graph()
      // Layout options
      // https://github.com/cpettitt/dagre/wiki#configuring-the-layout
      layout.setGraph({
        // The direction of the tree (e.g. LR means left-to-right)
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
        const lessonId = lesson.lessonId
        layout.setNode(lessonId, {
          lesson,
          lessonStatus: this.lessonStatus(lesson),
          extendedPostreqs: this.getExtendedPostreqs(lesson),
          width: this.nodeWidth,
          height: this.nodeHeight
        })
        // Sort postreqs by their number of immediate prereqs, descending,
        // so that more difficult to place nodes are given priority
        sortBy(
          this.getPostrequisiteLessons(lesson),
          [postreq => -1 * this.getImmediatePrereqsCount(postreq)]
        ).forEach(postreq => {
          layout.setEdge(lessonId, postreq.lessonId)
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
      return this.layout.nodes().map(nodeKey => this.layout.node(nodeKey))
    },
    lessonEdges () {
      return this.layout.edges().map(nodeKeys => {
        const startNode = this.layout.node(nodeKeys.v)
        const endNode = this.layout.node(nodeKeys.w)
        const startNodeX = this.nodeOffsetX(startNode) + startNode.width
        const endNodeX = this.nodeOffsetX(endNode)
        const horizontalDistance = endNodeX - startNodeX
        const cardWidthWithMargin = this.nodeWidth + this.nodeMarginHorizontal
        const halfCardHeight = this.nodeHeight / 2
        const cardHeightWithMargin = this.nodeHeight + this.nodeMarginVertical
        const halfCardHeightWithMargin = cardHeightWithMargin / 2
        const halfNodeMarginHorizontal = this.nodeMarginHorizontal / 2
        const cardsAwayCount = Math.floor(horizontalDistance / cardWidthWithMargin)
        // Pulls the final resting point upwards or downwards
        // on the card, depending on the horizontal and
        // vertical distance from the starting card.
        const connectPointMinPercentFromEdge = 0.1 // 10%
        const connectPointMaxDrift = halfCardHeight - halfCardHeight * connectPointMinPercentFromEdge
        // This is an arbitrary number, chosen for aesthetic
        // appeal with our particular layout. If we're
        // generally getting too much pull, we can increase
        // this number. To increase pull, we can decrease it.
        const connectPointResistanceFactor = 6
        const yPull = Math.min(
          // Max pull
          connectPointMaxDrift,
          // Base pull
          this.nodeHeight / connectPointResistanceFactor *
            // More pull for cards further away, horizontally
            (cardsAwayCount + 1) *
            // More pull for cards further away, vertically
            Math.abs(startNode.y - endNode.y) / this.nodeHeight
        )
        const startNodeY = startNode.y
        const endNodeY = (
          startNode.y === endNode.y ||
          endNode.lesson.prerequisiteLessonIds.length === 1
        ) ? endNode.y
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
          startNode,
          endNode,
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
    'course.projectCompletions': 'scrollToRecommendedLessons',
    hoveredLesson (newHoveredLesson) {
      this.$emit('lesson-hover', newHoveredLesson)
    }
  },
  methods: {
    canUpdateLesson,
    userCourseLessonProjectRepoUrl,
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
      return '/courses/' + this.course.courseKey + '/lessons/' + lesson.lessonKey
    },
    editLessonPath (lesson) {
      return '/lessons/' + lesson.lessonKey + '/edit'
    },
    lessonStatus (lesson) {
      if (!this.course) return {}
      return courseLessonUserStatus(this.course, lesson, this.currentUser)
    },
    lessonLang (lesson) {
      return lesson.lessonKey.match(/^(\w+?)-/)[1]
    },
    langColor (lang) {
      return design.code.langColors.light[lang]
    },
    langColorDark (lang) {
      return design.code.langColors.dark[lang]
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
      return courseLessonGradePointsRounded(this.course, lesson)
    },
    getProjectCompletion (lesson) {
      return courseLessonUserProjectCompletion(this.course, lesson, this.currentUser)
    },
    getExtendedPostreqs (lesson) {
      const immediatePostreqs = this.getPostrequisiteLessons(lesson)
      return (
        immediatePostreqs.concat(
          immediatePostreqs.map(
            postreq => this.getExtendedPostreqs(postreq)
          ).reduce((a, b) => a.concat(b), [])
        )
      )
    },
    getPostrequisiteLessons (lesson) {
      return this.lessons.filter(
        postreq => postreq.prerequisiteLessonIds.includes(lesson.lessonId)
      ).filter(postreq => postreq)
    },
    getImmediatePrereqsCount (lesson) {
      return lesson.prerequisiteLessonIds.filter(
        prereqLessonId => this.lessons.some(
          lesson => lesson.lessonId === prereqLessonId
        )
      ).length
    },
    scrollToRecommendedLessons () {
      const recommendedLessonsOffsets = this.lessonNodes
        .filter(node => node.lessonStatus.recommended)
        .map(node => this.nodeOffsetX(node))
      const minRecommendedOffset = Math.min(...recommendedLessonsOffsets)
      this.$refs.container.scrollLeft = minRecommendedOffset
    },
    nodeHasSelectedPostreq (node) {
      return (
        this.hoveredLesson &&
        !node.lessonStatus.approved &&
        node.extendedPostreqs.some(
          postreq => postreq.lessonId === this.hoveredLesson.lessonId
        )
      )
    },
    edgeHasSelectedPostreq (edge) {
      return (
        this.hoveredLesson &&
        !edge.endNode.lessonStatus.approved &&
        (
          edge.endNode.lesson.lessonId === this.hoveredLesson.lessonId ||
          edge.endNode.extendedPostreqs.some(
            postreq => postreq.lessonId === this.hoveredLesson.lessonId
          )
        )
      )
    },
    startNodeHover (node) {
      if (node.lessonStatus.approved) return
      this.hoverTimeout = setTimeout(() => {
        this.hoveredLesson = node.lesson
      }, 500)
    },
    endNodeHover (node) {
      clearTimeout(this.hoverTimeout)
      this.hoveredLesson = null
    }
  }
}
</script>
