<template>
  <div class="lesson-graph-container">
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
        height: nodeHeight + 'px'
      }"
      :to="nodeClickPath(node.lesson)"
      class="lesson-graph-card container-link"
    >
      <router-link
        v-if="course && canUpdateLesson({ lessonKey: node.lesson['.key'] })"
        class="button inline lessons-map-edit-lesson-button"
        :to="editLessonPath(node.lesson)"
      >Edit</router-link>
      <h3>{{ node.lesson.title }}</h3>
      <div class="lesson-graph-card-scrollable">
        <strong v-if="node.lesson.learningObjectives">
          Objectives
        </strong>
        <ul>
          <li v-for="objective in node.lesson.learningObjectives">
            {{ objective.content }}
          </li>
        </ul>
        <strong v-if="node.lesson.technologies">
          Technologies
        </strong>
        <ul v-for="tech in node.lesson.technologies">
          <li>{{ tech.title }}</li>
        </ul>
        <p>
          <strong>Duration:</strong>
          <span>{{ node.lesson.estimatedHours }} hours</span>
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
import Dagre from 'dagre'
import { path as D3Path } from 'd3-path'
import { canUpdateLesson } from '@state/auth/lessons'
import design from '@config/design'

const gutterWidth = design.layout.gutterWidth.replace('px', '')

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
      nodeHeight: 240
    }
  },
  computed: {
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
        nodesep: gutterWidth,
        ranksep: gutterWidth * 3
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
  methods: {
    nodeTransform (node) {
      return `translate(${
        node.x - this.nodeWidth / 2 + 'px'
      },${
        node.y - this.nodeHeight / 2 + 'px'
      })`
    },
    edgePath (edge) {
      const path = D3Path()
      const [ startingPoint, middlePoint, endPoint ] = edge.points
      path.moveTo(startingPoint.x, startingPoint.y)
      path.quadraticCurveTo(
        middlePoint.x, middlePoint.y,
        endPoint.x, endPoint.y
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
    canUpdateLesson
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.lesson-graph-container
  position: relative
  overflow-y: auto
.lesson-graph-card
  display: flex
  flex-direction: column
  position: absolute
  top: 0
  padding: $design.layout.gutterWidth
  border: 1px solid $design.branding.primary.light
  > h3
    margin-top: 0
.lesson-graph-card-scrollable
  overflow: hidden
  overflow-y: auto
  max-height: 100%
.lessons-map-edit-lesson-button
  position: absolute
  top: 0
  right: 0
  border-top: none
  border-right: none
  border-top-left-radius: 0
  border-bottom-right-radius: 0
path
  stroke: $design.branding.primary.light
  stroke-width: 2px
  fill: transparent
  pointer-events: none
</style>
