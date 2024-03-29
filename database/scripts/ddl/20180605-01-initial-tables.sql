\set ON_ERROR_STOP on

-- id_sequence
CREATE SEQUENCE id_sequence AS BIGINT INCREMENT BY 1 START WITH 1;

GRANT USAGE, SELECT ON SEQUENCE id_sequence TO CURRENT_USER;

-- app_user
CREATE TABLE app_user (
  user_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role_instructor BOOLEAN NOT NULL DEFAULT FALSE,
  github_login TEXT,
  github_scope TEXT,
  github_token TEXT,
  github_token_type TEXT,
  github_user_id BIGINT,
  msu_uid TEXT,
  version INTEGER,
  PRIMARY KEY (user_id)
);

GRANT ALL ON app_user TO CURRENT_USER;

CREATE INDEX app_user_email_index ON app_user (email);

CREATE INDEX app_user_msu_uid_index ON app_user (msu_uid);

CREATE INDEX app_user_github_login_index ON app_user (github_login);

-- lesson
CREATE TABLE lesson (
  lesson_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_key TEXT NOT NULL UNIQUE,
  title TEXT,
  estimated_hours INT,
  content TEXT,
  notes TEXT,
  project_key TEXT,
  project_title TEXT,
  project_hosting TEXT,
  version INTEGER,
  PRIMARY KEY (lesson_id)
);

GRANT ALL ON lesson TO CURRENT_USER;

CREATE INDEX lesson_lesson_key_index ON lesson (lesson_key);

-- lesson_learning_objective
CREATE TABLE lesson_learning_objective (
  lesson_learning_objective_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_id BIGINT NOT NULL,
  position INT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER,
  PRIMARY KEY (lesson_learning_objective_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id)
);

GRANT ALL ON lesson_learning_objective TO CURRENT_USER;

CREATE INDEX lesson_learning_objective_lesson_id_index
ON lesson_learning_objective (lesson_id);

-- lesson_project_criterion
CREATE TABLE lesson_project_criterion (
  lesson_project_criterion_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  lesson_id BIGINT NOT NULL,
  position INT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER,
  PRIMARY KEY (lesson_project_criterion_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id)
);

GRANT ALL ON lesson_project_criterion TO CURRENT_USER;

CREATE INDEX lesson_project_criterion_lesson_id_index
ON lesson_project_criterion (lesson_id);

-- lesson_prerequisite
CREATE TABLE lesson_prerequisite (
  lesson_id BIGINT NOT NULL,
  prerequisite_lesson_id BIGINT NOT NULL,
  version INTEGER,
  PRIMARY KEY (lesson_id, prerequisite_lesson_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id),
  FOREIGN KEY (prerequisite_lesson_id) REFERENCES lesson (lesson_id)
);

GRANT ALL ON lesson_prerequisite TO CURRENT_USER;

CREATE INDEX lesson_prerequisite_lesson_id_index
ON lesson_prerequisite (lesson_id);

CREATE INDEX lesson_prerequisite_prerequisite_lesson_id_index
ON lesson_prerequisite (prerequisite_lesson_id);

-- course
CREATE TABLE course (
  course_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  course_key TEXT NOT NULL UNIQUE,
  title TEXT,
  credits INT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  syllabus TEXT NULL,
  version INTEGER,
  PRIMARY KEY (course_id)
);

GRANT ALL ON course TO CURRENT_USER;

CREATE INDEX course_course_key_index ON course (course_key);

-- course_lesson
CREATE TABLE course_lesson (
  course_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  version INTEGER,
  PRIMARY KEY (course_id, lesson_id),
  FOREIGN KEY (course_id) REFERENCES course (course_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id)
);

GRANT ALL ON course_lesson TO CURRENT_USER;

CREATE INDEX course_lesson_course_id_index ON course_lesson (course_id);

CREATE INDEX course_lesson_lesson_id_index ON course_lesson (lesson_id);

-- course_instructor
CREATE TABLE course_instructor (
  course_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  version INTEGER,
  PRIMARY KEY (course_id, user_id),
  FOREIGN KEY (course_id) REFERENCES course (course_id),
  FOREIGN KEY (user_id) REFERENCES app_user (user_id)
);

GRANT ALL ON course_instructor TO CURRENT_USER;

CREATE INDEX course_instructor_course_id_index ON course_instructor (course_id);

CREATE INDEX course_instructor_user_id_index ON course_instructor (user_id);

-- course_student
CREATE TABLE course_student (
  course_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  version INTEGER,
  PRIMARY KEY (course_id, user_id),
  FOREIGN KEY (course_id) REFERENCES course (course_id),
  FOREIGN KEY (user_id) REFERENCES app_user (user_id)
);

GRANT ALL ON course_student TO CURRENT_USER;

CREATE INDEX course_student_course_id_index ON course_student (course_id);

CREATE INDEX course_student_user_id_index ON course_student (user_id);

-- course_student_pending
CREATE TABLE course_student_pending (
  course_id BIGINT NOT NULL,
  email TEXT NOT NULL,
  version INTEGER,
  PRIMARY KEY (course_id, email),
  FOREIGN KEY (course_id) REFERENCES course (course_id)
);

GRANT ALL ON course_student_pending TO CURRENT_USER;

CREATE INDEX course_student_pending_course_id_index
ON course_student_pending (course_id);

CREATE INDEX course_student_pending_email_index
ON course_student_pending (email);

-- project_completion
CREATE TABLE project_completion (
  project_completion_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  course_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  student_user_id BIGINT NOT NULL,
  repository_created_at TIMESTAMP NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  committed BOOLEAN NOT NULL DEFAULT FALSE,
  instructor_commented_last BOOLEAN NOT NULL DEFAULT FALSE,
  first_committed_at TIMESTAMP,
  approved_at TIMESTAMP,
  instructor_user_id BIGINT,
  first_submitted_at TIMESTAMP,
  last_commented_at TIMESTAMP,
  version INTEGER,
  PRIMARY KEY (project_completion_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson (lesson_id),
  FOREIGN KEY (student_user_id) REFERENCES app_user (user_id),
  FOREIGN KEY (course_id, instructor_user_id)
    REFERENCES course_instructor (course_id, user_id)
);

GRANT ALL ON project_completion TO CURRENT_USER;

CREATE INDEX project_completion_lesson_id_index
ON project_completion (lesson_id);

CREATE INDEX project_completion_student_user_id_index
ON project_completion (student_user_id);

CREATE INDEX project_completion_course_id_instructor_user_id_index
ON project_completion (course_id, instructor_user_id);
