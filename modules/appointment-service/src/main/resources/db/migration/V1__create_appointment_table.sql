create table if not exists appointment.appointments (
    id bigint not null,
    timeslot_id bigint not null,
    notes varchar(255),
    provider_id varchar(255) not null,
    status varchar(255) not null check ((status in ('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELED','NO_SHOW'))),
    student_id varchar(255) not null,
    last_modified_date timestamp(6),
    created_date timestamp(6),
    version bigint,
    primary key (id)
);