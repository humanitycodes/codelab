<template>
  <router-view/>
</template>

<style lang="stylus">
@import './meta'

*, *:before, *:after
  box-sizing: border-box

body
  font-family: 'Merriweather'
  font-weight: 300
  color: $design.body.text.color
  overflow-x: hidden

body, i.fa
  line-height: 1.7

h1, h2, h3, h4, h5, h6
  font-family: 'Lato'
  line-height: 1.3

h1, h2
  margin-top: 0

h4
  text-transform: uppercase

a
  color: $design.branding.primary.light
  text-decoration: none
  &:hover
    color: $design.branding.primary.dark
    text-decoration: underline
  &[name]
    color: $design.branding.primary.dark
    position: relative
    &:hover:before
      content: '#'
      position: absolute
      left: -0.8em

hr
  width: 30%
  border: none
  border-top: 5px solid $design.branding.primary.dark
  border-radius: 5px
  margin: $design.layout.gutterWidth auto

// -----------
// CODE BLOCKS
// -----------

code
  font-family: 'PT Mono'
pre
  background-color: $design.branding.muted.light.tan
  overflow-y: hidden
  position: relative
  &:before, &:after
    content: ''
    width: $design.layout.gutterWidth
    height: 100%
    position: absolute
    top: 0
    z-index: 1
  &:before
    left: 0
    background-image: linear-gradient(to left, rgba(255,255,255,0), $design.branding.muted.light.tan)
  &:after
    right: 0
    background-image: linear-gradient(to right, rgba(255,255,255,0), $design.branding.muted.light.tan)
  code
    display: block
    padding: $design.layout.gutterWidth
    &:after
      content: 'click to open'
      position: absolute
      top: 0
      right: 0
      padding: $design.layout.gutterWidth / 3 $design.layout.gutterWidth / 2
      pointer-events: none
      opacity: 0
      transition: opacity 0.2s
      z-index: 2
  a:hover
    text-decoration: none
    code:after
      opacity: 1

.xml, .html
  .css, .javascript
    opacity: 1

.hljs
  background: transparent
  color: $design.branding.primary.dark
  padding: $design.layout.gutterWidth
.hljs-comment
  color: #888

// -------
// BUTTONS
// -------

.button, button, input[type="submit"], input[type="reset"], input[type="button"]
  display: inline-block
  height: $design.control.height
  padding: 0 30px
  color: $design.body.text.color
  text-align: center
  font-size: 11px
  font-weight: 600
  line-height: $design.control.height
  letter-spacing: .1rem
  text-transform: uppercase
  text-decoration: none
  white-space: nowrap
  background-color: transparent
  border-radius: $design.control.border.radius
  border: 1px solid $design.control.border.color
  cursor: pointer
  &:hover, &:focus
    color: darken($design.body.text.color, 20%)
    border-color: darken($design.control.border.color, 30%)
    outline: 0
  &[disabled]
    opacity: .6
  &.block
    display: block
    width: 100%
    margin-top: $design.layout.gutterWidth
    margin-bottom: $design.layout.gutterWidth
  &.inline
    height: auto
    line-height: 1.7
    padding: 0 $design.control.padding.vertical - 1px 0 $design.control.padding.vertical
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

// -----
// FORMS
// -----

input:not([type]), input[type="email"], input[type="number"], input[type="search"], input[type="text"], input[type="tel"], input[type="date"], input[type="url"], input[type="password"], textarea, select
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
  color: $design.branding.primary.dark
  margin-top: $design.layout.gutterWidth
  margin-bottom: $design.layout.gutterWidth * .2
  font-weight: 600

fieldset
  padding: 0
  border-width: 0

.form-row
  display: flex
  margin: $design.layout.gutterWidth 0
  .form-group
    width: 100%
    margin: 0 $design.layout.gutterWidth * .5
    &:first-child
      margin-left: 0
    &:last-child
      margin-right: 0
    label
      margin-top: 0

// -----
// NOTES
// -----

p.warning
  padding: $design.layout.gutterWidth
  background-color: $design.branding.muted.light.yellow
  border: 1px solid $design.branding.warning.light
</style>
