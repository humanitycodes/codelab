\connect codelab_cas;
SET ROLE codelab_cas_admin;

-- id_sequence
CREATE SEQUENCE id_sequence AS BIGINT INCREMENT BY 1 START WITH 1;

-- app_user
CREATE TABLE app_user (
  user_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  github_login TEXT,
  github_scope TEXT,
  github_token TEXT,
  github_token_type TEXT,
  github_user_id BIGINT,
  msu_uid TEXT,
  PRIMARY KEY (user_id)
);

CREATE INDEX app_user_email_index ON app_user (email);

CREATE INDEX app_user_github_login_index ON app_user (github_login);

-- app_role
CREATE TABLE app_role (
  user_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (user_id, name),
  FOREIGN KEY (user_id) REFERENCES app_user (user_id)
);

-- lesson
CREATE TABLE lesson (
  lesson_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  estimated_hours INT NOT NULL,
  content TEXT NOT NULL,
  notes TEXT,
  PRIMARY KEY (lesson_id)
);

CREATE INDEX lesson_lesson_slug_index ON lesson (lesson_slug);

-- lesson_learning_objective
CREATE TABLE lesson_learning_objective (
  lesson_learning_objective_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_id BIGINT NOT NULL,
  position INT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (lesson_learning_objective_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id)
);

CREATE INDEX lesson_learning_objective_lesson_id_index
ON lesson_learning_objective (lesson_id);

-- lesson_project
CREATE TABLE lesson_project (
  lesson_project_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  hosting TEXT NOT NULL,
  PRIMARY KEY (lesson_project_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id)
);

CREATE INDEX lesson_project_lesson_id_index
ON lesson_project (lesson_id);

-- lesson_project_criterion
CREATE TABLE lesson_project_criterion (
  lesson_project_criterion_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_project_id BIGINT NOT NULL,
  position INT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (lesson_project_criterion_id),
  FOREIGN KEY (lesson_project_id) REFERENCES lesson_project (lesson_project_id)
);

CREATE INDEX lesson_project_criterion_lesson_project_id_index
ON lesson_project_criterion (lesson_project_id);

-- lesson_prerequisite
CREATE TABLE lesson_prerequisite (
  lesson_id BIGINT NOT NULL,
  prerequisite_lesson_id BIGINT NOT NULL,
  PRIMARY KEY (lesson_id, prerequisite_lesson_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id),
  FOREIGN KEY (prerequisite_lesson_id) REFERENCES lesson (lesson_id)
);

CREATE INDEX lesson_prerequisite_lesson_id_index
ON lesson_prerequisite (lesson_id);

CREATE INDEX lesson_prerequisite_prerequisite_lesson_id_index
ON lesson_prerequisite (prerequisite_lesson_id);

-- course
CREATE TABLE course (
  course_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  course_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  credits INT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  syllabus TEXT NULL,
  PRIMARY KEY (course_id)
);

CREATE INDEX course_course_slug_index ON course (course_slug);

-- course_lesson
CREATE TABLE course_lesson (
  course_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  PRIMARY KEY (course_id, lesson_id),
  FOREIGN KEY (course_id) REFERENCES course (course_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id)
);

CREATE INDEX course_lesson_course_id_index ON course_lesson (course_id);

CREATE INDEX course_lesson_lesson_id_index ON course_lesson (lesson_id);

-- course_instructor
CREATE TABLE course_instructor (
  course_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (course_id, user_id),
  FOREIGN KEY (course_id) REFERENCES course (course_id),
  FOREIGN KEY (user_id) REFERENCES app_user (user_id)
);

CREATE INDEX course_instructor_course_id_index ON course_instructor (course_id);

CREATE INDEX course_instructor_user_id_index ON course_instructor (user_id);

-- course_student
CREATE TABLE course_student (
  course_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (course_id, user_id),
  FOREIGN KEY (course_id) REFERENCES course (course_id),
  FOREIGN KEY (user_id) REFERENCES app_user (user_id)
);

CREATE INDEX course_student_course_id_index ON course_student (course_id);

CREATE INDEX course_student_user_id_index ON course_student (user_id);

-- course_student_pending
CREATE TABLE course_student_pending (
  course_id BIGINT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (course_id, email),
  FOREIGN KEY (course_id) REFERENCES course (course_id)
);

CREATE INDEX course_student_pending_course_id_index
ON course_student_pending (course_id);

CREATE INDEX course_student_pending_email_index
ON course_student_pending (email);

-- project_completion
CREATE TABLE project_completion (
  project_completion_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  course_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  lesson_project_id BIGINT NOT NULL,
  repository_created_at TIMESTAMP NOT NULL,
  is_approved BOOLEAN NOT NULL,
  committed BOOLEAN,
  first_committed_at TIMESTAMP,
  approved_at TIMESTAMP,
  assigned_instructor_id BIGINT,
  first_submitted_at TIMESTAMP,
  instructor_commented_last BOOLEAN,
  last_commented_at TIMESTAMP,
  PRIMARY KEY (project_completion_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id),
  FOREIGN KEY (lesson_project_id) REFERENCES lesson_project (lesson_project_id),
  FOREIGN KEY (course_id, assigned_instructor_id)
    REFERENCES course_instructor (course_id, user_id)
);

CREATE INDEX project_completion_lesson_id_index
ON project_completion (lesson_id);

CREATE INDEX project_completion_lesson_project_id_index
ON project_completion (lesson_project_id);

CREATE INDEX project_completion_course_id_assigned_instructor_id_index
ON project_completion (course_id, assigned_instructor_id);

-- project_completion_student
CREATE TABLE project_completion_student (
  project_completion_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (project_completion_id, user_id),
  FOREIGN KEY (project_completion_id)
    REFERENCES project_completion (project_completion_id),
  FOREIGN KEY (course_id, user_id)
    REFERENCES course_student (course_id, user_id)
);

CREATE INDEX project_completion_student_project_completion_id_index
ON project_completion_student (project_completion_id);

CREATE INDEX project_completion_student_course_id_user_id_index
ON project_completion_student (course_id, user_id);
