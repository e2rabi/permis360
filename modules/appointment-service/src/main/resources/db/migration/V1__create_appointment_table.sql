create table if not exists appointment.appointments (
                                          created_date timestamp(6),
                                          id bigint not null,
                                          last_modified_date timestamp(6),
                                          student_id bigint not null,
                                          timeslot_id bigint not null,
                                          version bigint,
                                          notes varchar(255),
                                          status varchar(255) not null check ((status in ('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELED','NO_SHOW'))),
                                          primary key (id)
);