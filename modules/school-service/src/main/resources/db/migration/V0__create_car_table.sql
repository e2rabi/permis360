CREATE SEQUENCE IF NOT EXISTS school.car_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.cars (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('car_sequence'),
    created_date timestamp(6),
    last_modified_date timestamp(6),
    version bigint,
    model varchar(255),
    plate_number varchar(255) unique
);