CREATE SEQUENCE IF NOT EXISTS school.payment_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.payments (
                                 id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('payment_sequence'),
                                 amount integer,
                                 created_date timestamp(6),
                                 last_modified_date timestamp(6),
                                 payment_date timestamp(6),
                                 version bigint,
                                 student_id BIGINT,
                                 method varchar(255) check ((method in ('CASH','TRANSFER')))
);