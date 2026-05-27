CREATE SEQUENCE IF NOT EXISTS school.lesson_slot_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.lesson_slots (
                                     id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('lesson_slot_sequence'),
                                     created_date timestamp(6),
                                     end_time timestamp(6),
                                     last_modified_date timestamp(6),
                                     start_time timestamp(6),
                                     version bigint,
                                     car_id BIGINT,
                                     instructor_id BIGINT,
                                     student_id BIGINT,
                                     status varchar(255) check ((status in ('AVAILABLE','BOOKED')))
);