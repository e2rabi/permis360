CREATE TABLE IF NOT EXISTS school (
                        id bigint not null,
                        created_date timestamp(6),
                        last_modified_date timestamp(6),
                        version bigint,
                        address varchar(255),
                        description varchar(255),
                        email varchar(255),
                        facebook varchar(255),
                        instagram varchar(255),
                        logo varchar(255),
                        name varchar(255),
                        phone_number1 varchar(255),
                        phone_number2 varchar(255),
                        status enum ('ACTIVE','CLOSED','INACTIVE','OPEN','RENOVATION'),
                        website varchar(255),
                        geo_location_id bigint,
                        primary key (id)
);
alter table if exists school drop constraint if exists UK2k41kx853aiwwvsxu0567y7c6 ;
alter table if exists school add constraint UK2k41kx853aiwwvsxu0567y7c6 unique (geo_location_id);

alter table if exists school
    add constraint FKfwkxwk1xh7d0tpokyqev6nk6f
    foreign key (geo_location_id)
    references geo_location;