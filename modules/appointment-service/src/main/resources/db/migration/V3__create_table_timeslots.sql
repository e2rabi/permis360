create table if not exists appointment.timeslots (
    id bigint not null,
    capacity integer,
    date date,
    end_time time(0),
    reserved integer,
    start_time time(0),
    status smallint check ((status between 0 and 3)),
    created_date timestamp(6),
    last_modified_date timestamp(6),
    provider_id bigint,
    version bigint,
    primary key (id)
);