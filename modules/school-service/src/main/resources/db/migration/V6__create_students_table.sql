CREATE SEQUENCE IF NOT EXISTS school.student_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.students (
                                 id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('student_sequence'),
                                 paid_amount float(53),
                                 registration_date date,
                                 total_amount float(53),
                                 created_date timestamp(6),
                                 last_modified_date timestamp(6),
                                 version bigint,
                                 school_id bigint,
                                 cin varchar(255) unique,
                                 first_name varchar(255),
                                 last_name varchar(255),
                                 phone varchar(255) unique,
                                 status varchar(255) check ((status in ('ACTIVE','COMPLETED','ARCHIVED')))
);