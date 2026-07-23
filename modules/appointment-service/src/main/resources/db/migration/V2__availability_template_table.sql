create table if not exists appointment.availability_template (
                                                   id bigint not null,
                                                   active boolean not null,
                                                   capacity integer,
                                                   end_time time(0),
                                                   slot_duration integer,
                                                   start_time time(0),
                                                   created_date timestamp(6),
                                                   last_modified_date timestamp(6),
                                                   provider_id bigint,
                                                   version bigint,
                                                   day_of_week varchar(255) not null check ((day_of_week in ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'))),
                                                   primary key (id)
);