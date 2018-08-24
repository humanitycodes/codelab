<template>
  <transition name="page-transition" appear>
    <div :key="$route.fullPath">
      <router-view/>
    </div>
  </transition>
</template>

<script>
import '@assets/css/app.css'

export default {}
</script>

<style lang="stylus" scoped>
@import './meta'

.page-transition-enter-active, .page-transition-leave-active
  position: absolute
  width: 100%
.page-transition-enter-active
  transition: opacity .3s cubic-bezier(.01,.98,.71,.84)
  z-index: 30
.page-transition-leave-active
  transition: opacity .4s
  z-index: -1
.page-transition-enter, .page-transition-leave-active
  opacity: 0
</style>

<style lang="stylus">
@import './meta'

h1, h2, h3, h4, h5, h6
  font-family: Lato
  line-height: 1.3

h1, h2
  margin-top: 0

h3
  margin-top: $design.layout.gutterWidth * 2
  margin-bottom: $design.layout.gutterWidth

h4
  margin-top: $design.layout.gutterWidth * 1.5
  margin-bottom: $design.layout.gutterWidth
  text-transform: uppercase
  code
    text-transform: none

p
  margin: $design.layout.gutterWidth 0

:not(pre) > code
  padding-top: 0.2em
  padding-bottom: 0.2em
  background-color: $design.branding.muted.light.gray
  border-radius: $design.control.border.radius
  vertical-align: baseline
  &:before, &:after
    content: '\00a0'
    letter-spacing: -0.2em

img
  max-width: 100%

video, audio
  width: 100%

iframe
  width: 100%
  border: none

a
  color: lighten($design.branding.primary.light, 5%)
  text-decoration: none
  &:hover
    color: $design.branding.primary.dark
    text-decoration: underline
  &[name]
    color: $design.branding.primary.dark
    position: relative
    &:hover:before
      position: absolute
      left: -0.8em
  &.container-link
    color: inherit
    &:hover
      color: inherit
      text-decoration: none
  &:not(.button):not(.icon-link)[target=_blank]:not([href$=".jpg"]):not([href$=".jpeg"]):not([href$=".svg"]):not([href$=".png"]):not([href$=".gif"])
    &:after
      $external-link-symbol-size = .7em
      display: inline-block
      content: ''
      background-image: url('assets/images/external-link.svg')
      background-size: $external-link-symbol-size
      height: $external-link-symbol-size
      width: $external-link-symbol-size
      margin-left: 5px

hr
  width: 30%
  border: none
  border-top: 5px solid $design.branding.primary.dark
  border-radius: 5px
  margin: $design.layout.gutterWidth auto

blockquote
  font-size: 1.3em
  margin: 0
  padding: $design.layout.gutterWidth
  border-left: 5px solid rgba(0,0,0,.1)

strong, b
  font-weight: 700

summary
  cursor: pointer
  &:focus
    outline: none

// -----------
// CODE BLOCKS
// -----------

$code-tag-font-size = 10px
$code-tag-padding-vertical = 1px
code
  font-family: $design.code.font.family
pre:not(.CodeMirror-line)
  overflow-y: hidden
  position: relative
  border-radius: $design.control.border.radius
  &:before, &:after
    content: ''
    width: $design.layout.gutterWidth
    height: 100%
    position: absolute
    top: 0
    z-index: 1
  &:before
    left: 0
    background-image: linear-gradient(to left, rgba(255,255,255,0), $design.code.block.background)
  &:after
    right: 0
    background-image: linear-gradient(to right, rgba(255,255,255,0), $design.code.block.background)
  > code
    display: block
    padding: $design.layout.gutterWidth !important
    &:after
      content: 'CODE'
      position: absolute
      top: 0
      right: 0
      font-family: Lato
      font-size: $code-tag-font-size
      letter-spacing: 1px
      padding: $code-tag-padding-vertical 7px
      background-color: rgba(255,255,255,.4)
      border-bottom-left-radius: $design.control.border.radius
      color: #FFF
      z-index: 2
    &[data-filename][data-filename]:after
      content: attr(data-filename)
      text-transform: uppercase
  &.sh > code
  &.sh > code
    &:after
      content: 'TERMINAL'
    .hljs-built_in
      color: inherit
  &.html > code:after
    content: 'HTML'
  &.css > code:after
    content: 'CSS'
  &.scss > code:after
    content: 'SCSS'
  &.js > code:after
    content: 'JAVASCRIPT'
  &.json > code:after
    content: 'JSON'
  &.ejs > code:after
    content: 'EJS'
  &.txt > code:after
    content: 'TEXT'
  &.notepad
    border: 1px solid $design.control.border.color
    &:before
      content: none
    &:after
      content: none
    > code
      color: black
      font-family: monospace
      background-color: white
      &:after
        content: 'NOTEPAD'
  &.output
    cursor: not-allowed
    user-select: none
    > code:after
      content: 'OUTPUT'
  + .result, + .output
    margin-top: "calc(-1em - %s)" % $design.control.border.radius
    border-top: $design.control.border.radius solid $design.code.block.background
    border-top-left-radius: 0
    border-top-right-radius: 0
    background-color: $design.branding.default.light
    position: relative
    z-index: 1
  + .output
    border-top: 1px solid transparentify($design.code.block.background, white, .6)

.xml, .html
  .css, .javascript
    opacity: 1

div.result
  pre
    &:before
      content: none
    &:after
      content: none

// ------
// TABLES
// ------

table
  width: 100%
  margin: $design.layout.gutterWidth 0

th, td
  padding: $design.layout.gutterWidth * .5
  border: 1px solid $design.control.border.color
  background-color: $design.branding.muted.light.tan

table.dashboard-info
  font-family: Lato, Verdana, Arial, sans-serif
  font-weight: 400
  padding: 3px
  background-color: $design.branding.default.light
  border-radius: $design.control.border.radius
  border-spacing: 0
  border-collapse: separate
  box-shadow: 0 0 2px 1px #ddd
  th
    background-color: transparent
    border: 0
    border-left: 1px solid $design.control.border.color
    border-bottom: 1px solid $design.control.border.color
    vertical-align: bottom
  td
    background-color: transparent
    border: 0
    border-left: 1px solid $design.control.border.color
  th:first-child, td:first-child
    border-left: 0
  tr:nth-of-type(even)
    background-color: darken($design.branding.default.light, 5%)

.numeric-cell
  text-align: right

// -------
// BUTTONS
// -------

.button, button, input[type="submit"], input[type="reset"], input[type="button"]
  display: inline-block
  height: $design.control.height
  padding: 0 $design.control.height * .4
  color: $design.body.text.color
  text-align: center
  font-size: $design.control.height * .3
  font-weight: 600
  line-height: $design.control.height
  letter-spacing: .1rem
  text-transform: uppercase
  text-decoration: none
  white-space: nowrap
  background-color: $design.branding.default.light
  border-radius: $design.control.border.radius
  border: 1px solid $design.control.border.color
  cursor: pointer
  &:hover, &:focus
    color: darken($design.body.text.color, 20%)
    border-color: darken($design.control.border.color, 30%)
    outline: 0
    text-decoration: none
  &[disabled]
    opacity: .6
    cursor: not-allowed
  &.block
    display: block
    width: 100%
    margin-top: $design.layout.gutterWidth
    margin-bottom: $design.layout.gutterWidth
  &.inline
    height: auto
    line-height: 1.7
    padding: 2px $design.control.padding.vertical - 1px 0 $design.control.padding.vertical
    vertical-align: middle
    margin-top: -2px
  &.primary
    color: #FFF
    background-color: $design.branding.primary.light
    border-color: $design.branding.primary.dark
    &:hover, &:focus
      background-color: darken($design.branding.primary.light, 20%)
  &.danger
    color: #FFF
    background-color: $design.branding.danger.light
    border-color: $design.branding.danger.dark
    &:hover, &:focus
      background-color: darken($design.branding.danger.light, 30%)
  &.warning
    color: #FFF
    background-color: $design.branding.warning.light
    border-color: $design.branding.warning.dark
    &:hover, &:focus
      background-color: darken($design.branding.warning.light, 10%)
  &.extra-large
    $button-extra-large-height = $design.control.height * 3
    height: $button-extra-large-height
    line-height: $button-extra-large-height
    font-size: $button-extra-large-height * .3
    padding: 0 $button-extra-large-height * .4

// -----
// FORMS
// -----

input:not([type]), input[type="email"], input[type="number"], input[type="search"], input[type="text"]:not(.CodeMirror-search-field), input[type="tel"], input[type="date"], input[type="url"], input[type="password"], textarea, select
  height: $design.control.height
  // The 6px vertically centers text on FF, ignored by Webkit
  padding: $design.control.padding.vertical $design.control.padding.horizontal
  background-color: #fff
  border: 1px solid $design.control.border.color
  border-radius: $design.control.border.radius
  box-shadow: none
  vertical-align: bottom
  &:focus
    border: 1px solid $design.branding.primary.light
    outline: 0
  &[disabled]
    opacity: .8
    cursor: not-allowed

// Removes awkward default styles on some inputs for iOS
input:not([type]), input[type="email"], input[type="number"], input[type="search"], input[type="text"], input[type="tel"], input[type="date"], input[type="url"], input[type="password"], textarea
    appearance: none
    width: 100%

input[type="checkbox"], input[type="radio"]
  display: inline

textarea
  min-height: 100px
  resize: vertical

label, legend
  display: block
  color: $design.body.text.color
  margin-bottom: $design.layout.gutterWidth * .2
  font-weight: 600
  font-family: Lato
  font-size: 1.1em

label.with-inline-input
  cursor: pointer
  margin-bottom: 0
  > input
    margin-right: 5px
    position: relative
    bottom: 1px

label > input[type=checkbox]
  height: 1rem
  vertical-align: middle
  cursor: pointer
  + span
    vertical-align: middle
    cursor: pointer

fieldset
  padding: 0
  border-width: 0

.stretch-row
  margin: $design.layout.gutterWidth 0
  display: flex
  .stretch-col
    width: 100%
    margin: 0 $design.layout.gutterWidth * .5
    &:first-child
      margin-left: 0
    &:last-child
      margin-right: 0
    &[disabled]
      position: relative
      &:after
        content: ''
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: rgba(255,255,255,.4)
        cursor: not-allowed
      input[disabled]
        opacity: 1
    > :first-child
      margin-top: 0
    > :last-child
      margin-bottom: 0
.heading-basic-data
  opacity: .8
  margin-bottom: 0
  font-family: 'Lato'
  > .stretch-col:last-of-type:not(:only-of-type)
    text-align: right

// -----
// NOTES
// -----

p:empty
  display: none

p, div
  &.warning, &.danger, &.error, &.note, &.muted, &.result
    position: relative
    border-radius: $design.control.border.radius
    margin: $design.layout.gutterWidth 0
    &:after
      position: absolute
      top: 0
      right: 0
      font-family: Lato
      font-size: $code-tag-font-size
      letter-spacing: 1px
      padding: $code-tag-padding-vertical 7px
      border-bottom-left-radius: $design.control.border.radius
      z-index: 2
      color: white
    > :first-child
      margin-top: 0
    > :last-child
      margin-bottom: 0
  &.warning
    padding: $design.layout.gutterWidth
    background-color: $design.branding.muted.light.yellow
    border: 1px solid $design.branding.warning.light
    &:after
      content: 'WARNING'
      background-color: $design.branding.warning.dark
  &.danger, &.error
    padding: $design.layout.gutterWidth
    background-color: $design.branding.muted.light.red
    border: 1px solid $design.branding.danger.light
    &:after
      background-color: $design.branding.danger.dark
  &.error:after
    content: 'ERROR'
  &.danger:after
    content: 'DANGER'
  &.note
    padding: $design.layout.gutterWidth
    background: $design.branding.muted.light.note
    border: 1px solid $design.branding.note.light
    border-radius: $design.control.border.radius
    &:after
      content: 'NOTE'
      background-color: $design.branding.note.dark
  &.result
    padding: $design.layout.gutterWidth
    border: 1px solid $design.control.border.color
    border-radius: $design.control.border.radius
    &:after
      content: 'RESULT'
      background-color: rgba(0,0,0,.1)
      color: inherit
    &.poetry
      line-height: 1.7
      &:after
        content: 'POETRY'
      pre
        font-family: inherit
  &.muted
    opacity: .7

// ---------------
// LESSON-SPECIFIC
// ---------------

.result.headings-example
  .h2
    font-family: Lato
    font-size: 1.5em
    font-weight: bold
    line-height: 1.3
  h1, .h2, h3, h4, h5, h6
    margin: $design.layout.gutterWidth 0
  h1
    margin-top: 0p
  h3
    text-transform: none
  h6
    margin-bottom: 0
</style>
