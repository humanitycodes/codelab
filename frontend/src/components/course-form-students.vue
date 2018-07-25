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
        <li
          v-for="student in students"
          :key="student.userId"
        >
          {{ student.fullName }}
          (<a
            :name="'student-' + student.email"
            :href="'mailto:' + student.email"
            target="_blank"
          >{{ student.email }}</a>)
          <button
            :disabled="studentHasProjectCompletions(student)"
            :title="
              studentHasProjectCompletions(student)
                ? 'Students cannot be removed once they have started projects in the course'
                : 'Remove the student from this course'
            "
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
        <li
          v-for="preenrollment in preenrollments"
          :key="preenrollment"
        >
          <a
            :name="'student-' + preenrollment"
            :href="'mailto:' + preenrollment"
            target="_blank"
          >{{ preenrollment }}</a>
          <button
            @click="showRemovePreenrollmentModal(preenrollment)"
            class="inline danger"
            name="course-remove-student"
          >×</button>
        </li>
      </ul>
      <p
        v-if="!students.length && !preenrollments.length && !disabled"
        class="warning"
      >
        It's hardly a course without students. Add some when you think the
        course is ready to share.
      </p>
    </div>
    <ModalConfirm
      :show="showModalConfirmRemoveStudent"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemoveStudentModal"
    >
      <p>
        Are you sure you want to remove
        <strong>{{ studentPendingRemoval.fullName }}</strong>
        from the course?
      </p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
    <ModalConfirm
      :show="showModalConfirmRemovePreenrollment"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemovePreenrollmentModal"
    >
      <p>
        Are you sure you want to remove
        <strong>{{ preenrollmentPendingRemoval }}</strong>
        from the course?
      </p>
      <aside>This action cannot be undone.</aside>
    </ModalConfirm>
  </div>
</template>

<script>
import Dropdown from './dropdown'
import ModalConfirm from './modal-confirm'
import { userGetters, projectCompletionGetters } from '@state/helpers'

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
    ...projectCompletionGetters,
    students () {
      return this.users.filter(
        user => this.course.studentIds.includes(user.userId)
      )
    },
    preenrollments () {
      return this.course.pendingStudentEmails
    }
  },
  methods: {
    addStudent () {
      if (!this.studentEmail) return
      const cleanStudentEmail = this.studentEmail.trim().toLowerCase()
      // Student must be added by email address
      if (!/^[\w.]+@[\w.]+\.[\w.]+/.test(cleanStudentEmail)) return

      const student = this.findStudentByEmail(cleanStudentEmail)
      if (student) {
        // Enroll existing student
        this.course.studentIds.push(student.userId)
      } else {
        // Pre-enroll student that hasn't signed in yet
        this.course.pendingStudentEmails.push(cleanStudentEmail)
      }
      this.studentEmail = ''
      this.$refs.studentEmailInput.focus()
    },
    findStudentByEmail (email) {
      return this.users.find(user => (
        // User is not current user
        this.currentUser.userId !== user.userId &&
        // User is not already a student
        !this.course.studentIds.includes(user.userId) &&
        // Email address matches user's email
        user.email === email
      ))
    },
    showRemoveStudentModal (student) {
      this.studentPendingRemoval = student
      this.showModalConfirmRemoveStudent = true
    },
    onCloseRemoveStudentModal (confirmed) {
      this.showModalConfirmRemoveStudent = false
      if (confirmed) {
        const userId = this.studentPendingRemoval.userId
        const index = this.course.studentIds.indexOf(userId)
        this.course.studentIds.splice(index, 1)
      }
    },
    showRemovePreenrollmentModal (email) {
      this.preenrollmentPendingRemoval = email
      this.showModalConfirmRemovePreenrollment = true
    },
    onCloseRemovePreenrollmentModal (confirmed) {
      this.showModalConfirmRemovePreenrollment = false
      if (confirmed) {
        const email = this.preenrollmentPendingRemoval
        const index = this.course.pendingStudentEmails.indexOf(email)
        this.course.pendingStudentEmails.splice(index, 1)
      }
    },
    studentHasProjectCompletions (student) {
      return this.projectCompletions.some(completion =>
        completion.courseId === this.course.courseId &&
        completion.studentUserId === student.userId
      )
    }
  }
}
</script>
