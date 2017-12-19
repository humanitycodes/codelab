<template>
  <div class="flex-row">
    <div class="flex-col" :disabled="disabled">
      <label for="course-student-email">Enrolled Students</label>
      <input
        :disabled="disabled"
        ref="studentEmailInput"
        v-model="studentEmail"
        id="course-student-email"
        name="course-student-email"
        placeholder="Add students to the course"
        @keyup.enter="addStudent"
      >
      <ul v-if="students.length">
        <li v-for="student in students">
          {{ student.fullName }}
          (<a
            :name="'student-' + student.email"
            :href="'mailto:' + student.email"
            target="_blank"
          >{{ student.email }}</a>)
          <button
            @click="showRemoveStudentModal(student)"
            class="inline danger"
            name="course-remove-student"
          >×</button>
        </li>
      </ul>
      <p v-if="preenrollments.length" class="warning">
        The following students are enrolled, but have not signed in.
      </p>
      <ul v-if="preenrollments.length">
        <li v-for="preenrollment in preenrollments">
          <a
            :name="'student-' + preenrollment['.key']"
            :href="'mailto:' + preenrollment['.key']"
            target="_blank"
          >{{ preenrollment['.key'] }}</a>
          <button
            @click="showRemovePreenrollmentModal(preenrollment['.key'])"
            class="inline danger"
            name="course-remove-student"
          >×</button>
        </li>
      </ul>
      <p
        v-if="!students.length && !preenrollments.length && !disabled"
        class="warning"
      >
        It's hardly a course without students. Add some when you feel the course is ready to share.
      </p>
    </div>
    <ModalConfirm
      :show="showModalConfirmRemoveStudent"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemoveStudentModal"
    >
      <p>Are you sure you want to remove <strong>{{ studentPendingRemoval.fullName }}</strong> from the course?</p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
    <ModalConfirm
      :show="showModalConfirmRemovePreenrollment"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemovePreenrollmentModal"
    >
      <p>Are you sure you want to remove <strong>{{ preenrollmentPendingRemoval }}</strong> from the course?</p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
  </div>
</template>

<script>
import Dropdown from './dropdown'
import ModalConfirm from './modal-confirm'
import { userGetters } from '@state/helpers'

export default {
  components: {
    Dropdown,
    ModalConfirm
  },
  props: {
    course: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      studentEmail: '',
      preenrollmentPendingRemoval: '',
      showModalConfirmRemovePreenrollment: false,
      studentPendingRemoval: {},
      showModalConfirmRemoveStudent: false
    }
  },
  computed: {
    ...userGetters,
    students () {
      if (!this.course.studentKeys) return []
      return this.users.filter(user => {
        return this.course.studentKeys.indexOf(user['.key']) !== -1
      })
    },
    preenrollments () {
      return this.course.preenrollments || []
    }
  },
  methods: {
    addStudent () {
      if (!this.studentEmail) return
      const cleanStudentEmail = this.studentEmail.trim().toLowerCase()
      // Student must have @msu.edu email
      if (!/^[\w.]+@msu\.edu/.test(cleanStudentEmail)) return

      const student = this.findStudentByEmail(cleanStudentEmail)
      if (student) {
        // Enroll existing student
        this.course.addStudent(student['.key'])
      } else {
        // Pre-enroll student that hasn't signed in yet
        this.course.preenrollments.add({}, cleanStudentEmail)
      }
      this.studentEmail = ''
      this.$refs.studentEmailInput.focus()
    },
    findStudentByEmail (email) {
      if (!this.users.length) return null
      return this.users.find(user => {
        return (
          // User is not current user
          this.currentUser.uid !== user['.key'] &&
          // User is not already a student
          this.course.studentKeys.indexOf(user['.key']) === -1 &&
          // Email address matches user's email
          user.email === email
        )
      })
    },
    showRemoveStudentModal (student) {
      this.studentPendingRemoval = student
      this.showModalConfirmRemoveStudent = true
    },
    onCloseRemoveStudentModal (confirmed) {
      this.showModalConfirmRemoveStudent = false
      if (confirmed) {
        this.course.removeStudent(this.studentPendingRemoval['.key'])
      }
    },
    showRemovePreenrollmentModal (email) {
      this.preenrollmentPendingRemoval = email
      this.showModalConfirmRemovePreenrollment = true
    },
    onCloseRemovePreenrollmentModal (confirmed) {
      this.showModalConfirmRemovePreenrollment = false
      if (confirmed) {
        this.course.preenrollments.remove(this.preenrollmentPendingRemoval)
      }
    }
  }
}
</script>
