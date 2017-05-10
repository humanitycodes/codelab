<template>
  <transition name="modal">
    <div class="modal-mask" @click="close" v-show="show">
      <div class="modal-container" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  created () {
    document.addEventListener('keydown', e => {
      if (this.show && e.keyCode === 27) {
        this.close()
      }
    })
  }
}
</script>

<style lang="stylus">
@import '../meta'

.modal-mask
  position: fixed
  z-index: 9998
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, .5)
  transition: opacity .3s ease

.modal-container
  max-width: 500px
  margin: 40px auto 0
  padding: 20px 30px
  background-color: $design.body.background
  border-radius: $design.control.border.radius
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
  transition: all .3s ease

.modal-container footer
  border-top: 1px solid $design.control.border.color
  text-align: right
  padding-top: $design.layout.gutterWidth

.modal-enter
.modal-leave-to
  opacity: 0

.modal-enter .modal-container
.modal-leave-to .modal-container
  transform: scale(1.1)
</style>
