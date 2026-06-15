
ALTER TABLE school.students
DROP CONSTRAINT IF EXISTS students_status_check;

ALTER TABLE IF EXISTS school.students
    ADD COLUMN user_id VARCHAR(255) NOT NULL UNIQUE;
alter table if exists school.students
    add column email varchar(255) UNIQUE;

ALTER TABLE IF EXISTS school.students ALTER COLUMN status TYPE VARCHAR(255);

ALTER TABLE IF EXISTS school.students ADD CONSTRAINT students_status_check
    CHECK (status IN ('CREATED', 'ACTIVE', 'INACTIVE', 'GRADUATED'));