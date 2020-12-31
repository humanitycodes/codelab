<template>
  <div class="stretch-row" v-if="content">
    <div class="rendered-content-container stretch-col">
      <PageNavigation
        v-if="!paginationPlacement || paginationPlacement === 'top'"
        v-model="currentPage"
        :pages="pages"
      />
      <div
        v-html="currentPageContent"
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
import { highlight, highlightAuto, codeExtensions } from '@helpers/utils/dom/syntax-highlight'
import convertRichContentToHtml from '@helpers/utils/convert-rich-content-to-html'

export default {
  components: {
    PageNavigation: {
      render (h) {
        return (
          <div class='stretch-row rendered-content-page-navigation'>
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
                  'active': this.value === index + 1
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
      return convertRichContentToHtml(this.content)
    },
    currentPageContent () {
      return this.pages[this.validatedCurrentPage - 1].content
    },
    pages () {
      return chunk(compact(this.contentHtml.split(/<h2>(.+?)<\/h2>/)), 2).map(page => {
        const [title, content] = page
        return {
          title: this.decodeHtml(title),
          content: `<h2>${title}</h2>${content}`
        }
      })
    },
    validatedCurrentPage () {
      return isNaN(this.currentPage)
        ? 1
        : Math.min(
          this.pages.length,
          Math.max(1, this.currentPage)
        )
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
      const el = document.createElement('textarea')
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
            if (codeExtensions.includes(lang)) {
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
