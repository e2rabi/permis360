create table if not exists appointment.timeslots (
                                       max_capacity integer not null,
                                       created_date timestamp(6),
                                       end_time timestamp(6) not null,
                                       id bigint not null,
                                       instructor_id bigint not null,
                                       last_modified_date timestamp(6),
                                       school_id bigint not null,
                                       start_time timestamp(6) not null,
                                       version bigint,
                                       primary key (id)
);