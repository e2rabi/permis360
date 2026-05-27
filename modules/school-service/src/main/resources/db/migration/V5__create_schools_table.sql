CREATE SEQUENCE IF NOT EXISTS school.school_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists school.schools (
                                id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('school_sequence'),
                                created_date timestamp(6),
                                last_modified_date timestamp(6),
                                version bigint,
                                geo_location_id BIGINT unique,
                                address varchar(255),
                                description varchar(255),
                                email varchar(255) unique,
                                facebook varchar(255),
                                instagram varchar(255),
                                logo varchar(255),
                                name varchar(255),
                                primary_phone_number varchar(255) unique,
                                secondary_phone_number varchar(255) unique,
                                status varchar(255) check ((status in ('OPEN','CLOSED','RENOVATION','ACTIVE','INACTIVE'))),
                                website varchar(255)
);