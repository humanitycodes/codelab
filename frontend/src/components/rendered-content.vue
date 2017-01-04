<template>
  <div class="flex-row" v-if="content">
    <div class="rendered-content-container flex-col">
      <PageNavigation
        v-if="!paginationPlacement || paginationPlacement === 'top'"
        v-model="currentPage"
        :pages="pages"
      />
      <div
        v-html="pages[validatedCurrentPage - 1].content"
        ref="renderedContent"
        class="rendered-content"
      />
      <PageNavigation
        v-if="!paginationPlacement || paginationPlacement === 'bottom'"
        v-model="currentPage"
        :pages="pages"
        label-placement="top"
      />
    </div>
  </div>
</template>

<script>
import compact from 'lodash/compact'
import chunk from 'lodash/chunk'
import { highlight, highlightAuto } from 'highlight.js'
import { BlockCompiler } from 'rho'
const rho = new BlockCompiler({
  externalLinks: true
})

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
                data-title={page.title}
                on-click={() => this.toPage(index + 1)}
                class={{
                  'rendered-content-page-breadcrumb': true,
                  'label-placement-top': this.labelPlacement === 'top',
                  active: this.value === index + 1
                }}
              >
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
    paginationPlacement: String
  },
  data () {
    return {
      currentPage: this.initialPage
    }
  },
  computed: {
    contentHtml () {
      return rho.toHtml(this.content)
    },
    pages () {
      return chunk(compact(this.contentHtml.split(/<h2>(.+?)<\/h2>/)), 2).map(page => {
        const [ title, content ] = page
        return {
          title: this.decodeHtml(title),
          content: `
            <h2>${title}</h2>
            ${content}
          `
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
        const codeElements = this.$refs.renderedContent.querySelectorAll('pre > code')
        const codeLangs = ['sh', 'html', 'js', 'md', 'css', 'scss']
        const codeElementsCount = codeElements.length
        for (let i = 0; i < codeElementsCount; i++) {
          const codeEl = codeElements[i]
          const preEl = codeEl.parentNode
          if (preEl.classList.length) {
            const lang = preEl.classList[0]
            if (codeLangs.indexOf(lang) !== -1) {
              codeEl.innerHTML = highlight(lang, codeEl.textContent).value
            }
            const preClassesCount = preEl.classList.length
            for (let j = 0; j < preClassesCount; j++) {
              codeEl.classList.add(preEl.classList[j])
            }
          } else {
            codeEl.innerHTML = highlightAuto(codeEl.textContent, codeLangs).value
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

.rendered-content-page-breadcrumb
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  width: 100%
  &:not(.active):hover
    &:after
      content: attr(data-title)
      position: absolute
      top: $design.control.height + $design.layout.gutterWidth * .2
      left: 0
      width: 100%
      text-align: center
      font-weight: 600
      background-color: white
      box-shadow: 0 0 5px white
      color: $design.branding.primary.light
      z-index: 3
    &.label-placement-top
      &:after
        top: auto
        bottom: $design.control.height + $design.layout.gutterWidth * .2
  svg
    max-width: 10px
    max-height: 10px
  circle
    fill: lighten(desaturate($design.branding.primary.light, 70%), 60%)
  &.active
    cursor: default
    circle
      fill: transparent
      stroke-width: 1px
      stroke: $design.branding.primary.dark
</style>
