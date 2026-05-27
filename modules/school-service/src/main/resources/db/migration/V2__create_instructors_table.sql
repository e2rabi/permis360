CREATE SEQUENCE IF NOT EXISTS school.instructor_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.instructors (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('instructor_sequence'),
    created_date timestamp(6),
    last_modified_date timestamp(6),
    version bigint,
    school_id BIGINT,
    name varchar(255),
    phone varchar(255) unique
);