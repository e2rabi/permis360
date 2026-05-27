CREATE SEQUENCE IF NOT EXISTS school.geo_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.geo_location (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('car_sequence'),
    latitude float(53) not null,
    longitude float(53) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    version bigint
);