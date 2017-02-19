<template>
  <div class="flex-row" v-if="content">
    <div class="rendered-content-container flex-col">
      <PageNavigation
        v-if="!paginationPlacement || paginationPlacement === 'top'"
        v-model="currentPage"
        :pages="pages"
      />
      <div
        ref="renderedContent"
        class="rendered-content"
      >
        <span
          v-for="content in pages[validatedCurrentPage - 1].contentPartitions"
          v-html="content"
          :key="content"
        />
      </div>
      <PageNavigation
        v-if="!paginationPlacement || paginationPlacement === 'bottom'"
        v-model="currentPage"
        :pages="pages"
        label-placement="top"
      />
    </div>
  </div>
  <div v-else class="rendered-content-container rendered-content-no-content">
    <p v-if="noContentMessage" class="note">
      {{ noContentMessage }}
    </p>
    <img
      v-else
      src="../assets/images/loading.gif"
      alt="Loading"
      class="rendered-content-loading-image"
    >
  </div>
</template>

<script>
import compact from 'lodash/compact'
import chunk from 'lodash/chunk'
import { highlight, highlightAuto, codeExtensions } from '@helpers/syntax-highlight'
import toHtml from '@helpers/to-html'

export default {
  components: {
    PageNavigation: {
      render (h) {
        return (
          <div class='flex-row rendered-content-page-navigation'>
            <button
              on-click={this.toPrevPage}
              disabled={this.value === 1}
            >
              Prev
            </button>
            {this.pages.map((page, index) =>
              <div
                on-click={() => this.toPage(index + 1)}
                class={{
                  'rendered-content-page-breadcrumb': true,
                  'label-placement-top': this.labelPlacement === 'top',
                  active: this.value === index + 1
                }}
              >
                <div
                  class='rendered-content-page-breadcrumb-preview-title'
                  domPropsInnerHTML={ page.title.replace(/&/, '&amp;') }
                />
                <svg>
                  <circle
                    r='45%'
                    cx='50%'
                    cy='50%'
                  />
                </svg>
              </div>
            )}
            <button
              on-click={this.toNextPage}
              disabled={this.value === this.pages.length}
            >
              Next
            </button>
          </div>
        )
      },
      props: {
        value: {
          type: Number,
          required: true
        },
        pages: {
          type: Array,
          required: true
        },
        labelPlacement: {
          type: String,
          default: 'bottom'
        }
      },
      methods: {
        toNextPage () {
          if (this.value < this.pages.length) {
            this.$emit('input', this.value + 1)
          }
        },
        toPrevPage () {
          if (this.value > 1) {
            this.$emit('input', this.value - 1)
          }
        },
        toPage (newPage) {
          this.$emit('input', newPage)
        }
      }
    }
  },
  props: {
    initialPage: {
      type: Number,
      default: 1
    },
    content: String,
    paginationPlacement: String,
    noContentMessage: String
  },
  data () {
    return {
      currentPage: this.initialPage
    }
  },
  computed: {
    contentHtml () {
      return toHtml(this.content)
    },
    pages () {
      return chunk(compact(this.contentHtml.split(/<h2>(.+?)<\/h2>/)), 2).map(page => {
        const [ title, content ] = page
        return {
          title: this.decodeHtml(title),
          contentPartitions: `<h2>${title}</h2>${content}`
            .replace(/<iframe\s/ig, '__IFRAME_SPLIT__$&')
            .replace(/<\/iframe>/ig, '$&__IFRAME_SPLIT__')
            .split('__IFRAME_SPLIT__')
        }
      })
    },
    validatedCurrentPage () {
      const validatedCurrentPage = isNaN(this.currentPage)
        ? 1
        : Math.min(
          this.pages.length,
          Math.max(1, this.currentPage)
        )
      this.currentPage = validatedCurrentPage
      return validatedCurrentPage
    }
  },
  mounted () {
    this.highlightCode()
  },
  watch: {
    contentHtml () {
      this.highlightCode()
    },
    currentPage (newPage) {
      this.$emit('page-update', newPage)
      this.highlightCode()
    }
  },
  methods: {
    decodeHtml (text) {
      var el = document.createElement('textarea')
      el.innerHTML = text
      return el.value
    },
    highlightCode () {
      this.$nextTick(() => {
        if (!this.$refs.renderedContent) return
        const codeElements = this.$refs.renderedContent.querySelectorAll('pre > code:not(.hljs)')
        const codeElementsCount = codeElements.length
        for (let i = 0; i < codeElementsCount; i++) {
          const codeEl = codeElements[i]
          const preEl = codeEl.parentNode
          if (preEl.classList.length) {
            const lang = preEl.classList[0]
            const fileName = preEl.id
            if (fileName) {
              codeEl.setAttribute('data-filename', `${fileName}.${lang}`)
              preEl.removeAttribute('id')
            }
            if (codeExtensions.indexOf(lang) !== -1) {
              codeEl.innerHTML = highlight(lang, codeEl.textContent).value
            }
            const preClassesCount = preEl.classList.length
            for (let j = 0; j < preClassesCount; j++) {
              codeEl.classList.add(preEl.classList[j])
            }
          } else {
            codeEl.innerHTML = highlightAuto(codeEl.textContent).value
          }
          codeEl.classList.add('hljs')
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

.rendered-content-container
  display: flex
  flex-direction: column

.rendered-content
  flex-grow: 1
  border: 1px solid $design.branding.muted.light.gray
  padding: $design.layout.gutterWidth
  background-color: $design.branding.default.light
  border-radius: $design.control.border.radius
  overflow-y: auto
  img
    display: block
    margin: 0 auto
    padding: $design.layout.gutterWidth
  > :first-child
    margin-top: 0
  > :last-child
    margin-bottom: 0

.rendered-content-page-navigation
  align-items: stretch
  justify-content: space-between
  position: relative
  min-height: $design.control.height

.rendered-content-page-breadcrumb-preview-title
  display: none

.rendered-content-page-breadcrumb
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  width: 100%
  &:not(.active):hover
    .rendered-content-page-breadcrumb-preview-title
      display: block
      position: absolute
      top: $design.layout.gutterWidth * 1.5
      left: 0
      width: 100%
      text-align: center
      font-weight: 600
      color: $design.branding.primary.light
      z-index: 3
      background-color: transparent
      pointer-events: none
    circle
      fill: lighten(desaturate($design.branding.primary.light, 70%), 30%)
    &.label-placement-top
      .rendered-content-page-breadcrumb-preview-title
        top: auto
        bottom: $design.layout.gutterWidth * 1.5
  svg
    max-width: 10px
    max-height: 10px
  circle
    fill: lighten(desaturate($design.branding.primary.light, 70%), 60%)
  &.active
    cursor: default
    circle
      fill: $design.branding.primary.dark
      stroke-width: 1px
      stroke: $design.branding.primary.dark

.rendered-content-loading-image
  max-width: 50px
  display: block
  margin: 0 auto

.rendered-content-no-content > .note
  margin-top: 0
</style>
