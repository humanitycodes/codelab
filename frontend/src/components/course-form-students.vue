<template>
  <div class="stretch-row">
    <div class="stretch-col">
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
      <p v-if="disabled" class="warning">
        Students cannot be added until all other fields are provided.
      </p>
      <ul v-if="students.length">
        <li
          v-for="student in students"
          :key="student.userId"
        >
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
          >Remove</button>
          <a
            :name="'student-' + student.email"
            :href="'mailto:' + student.email"
            target="_blank"
          >{{ student.email }}</a>
          ({{ student.fullName }})
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
          <button
            @click="showRemovePreenrollmentModal(preenrollment)"
            class="inline danger"
            name="course-remove-student"
          >Remove</button>
          <a
            :name="'student-' + preenrollment"
            :href="'mailto:' + preenrollment"
            target="_blank"
          >{{ preenrollment }}</a>
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
import ModalConfirm from './modal-confirm'
import { userGetters, projectCompletionGetters } from '@state/helpers'
import removeArrayValue from '@helpers/utils/remove-array-value'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    ModalConfirm
  },
  props: {
    courseId: {
      type: Number,
      required: true
    },
    studentIds: {
      type: Array,
      default: () => []
    },
    pendingStudentEmails: {
      type: Array,
      default: () => []
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
      return sortBy(
        this.users.filter(user => this.studentIds.includes(user.userId)),
        [student => student.email]
      )
    },
    preenrollments () {
      return sortBy(this.pendingStudentEmails, [email => email])
    }
  },
  methods: {
    addStudent () {
      if (!this.studentEmail) return
      const cleanEmail = this.studentEmail.trim().toLowerCase()
      // Student must be added by email address
      if (!/^[\w.]+@[\w.]+\.[\w.]+/.test(cleanEmail)) return

      const student = this.findStudentByEmail(cleanEmail)
      if (student) {
        // Enroll existing student
        const modifiedStudentIds = this.studentIds.concat(student.userId)
        this.$emit('update:studentIds', modifiedStudentIds)
      } else {
        // Pre-enroll student that hasn't signed in yet
        const modifiedEmails = this.pendingStudentEmails.concat(cleanEmail)
        this.$emit('update:pendingStudentEmails', modifiedEmails)
      }
      this.studentEmail = ''
      this.$refs.studentEmailInput.focus()
    },
    findStudentByEmail (email) {
      return this.users.find(user => (
        // User is not already a student
        !this.studentIds.includes(user.userId) &&
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
        const modifiedStudentIds = removeArrayValue(this.studentIds, userId)
        this.$emit('update:studentIds', modifiedStudentIds)
      }
    },
    showRemovePreenrollmentModal (email) {
      this.preenrollmentPendingRemoval = email
      this.showModalConfirmRemovePreenrollment = true
    },
    onCloseRemovePreenrollmentModal (confirmed) {
      this.showModalConfirmRemovePreenrollment = false
      if (confirmed) {
        const modifiedEmails = removeArrayValue(
          this.pendingStudentEmails,
          this.preenrollmentPendingRemoval
        )
        this.$emit('update:pendingStudentEmails', modifiedEmails)
      }
    },
    studentHasProjectCompletions (student) {
      return this.projectCompletions.some(completion =>
        completion.courseId === this.courseId &&
        completion.studentUserId === student.userId
      )
    }
  }
}
</script>
