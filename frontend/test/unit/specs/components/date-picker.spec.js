import Vue from 'vue'
import DatePicker from '@components/date-picker'

describe('date-picker.vue', () => {
  let vm
  beforeEach(() => {
    vm = new Vue({
      template: '<DatePicker ref="datePicker" v-model="date"/>',
      components: { DatePicker },
      data: () => ({ date: undefined })
    }).$mount()
  })

  describe('when passed no props', () => {
    it('renders an input', () => {
      expect(vm.$el.tagName).to.equal('INPUT')
    })

    describe('the input', () => {
      it('has a value of ""', () => {
        expect(vm.$el.value).to.equal('')
      })
    })

    describe('when the input value is changed to "2000-01-09"', () => {
      beforeEach(done => {
        vm.$refs.datePicker.onInput({ target: { value: '2000-01-09' } })
        vm.$nextTick(done)
      })

      describe('the emitted date', () => {
        it('has a value of 947394000000', () => {
          expect(vm.date).to.equal(947394000000)
        })
      })
    })
  })

  describe('when the value prop is 1481311771161', () => {
    beforeEach(done => {
      vm.date = 1481311771161
      vm.$nextTick(done)
    })

    describe('the input', () => {
      it('updates to a value of "2016-12-09"', () => {
        expect(vm.$el.value).to.equal('2016-12-09')
      })
    })
  })
})
