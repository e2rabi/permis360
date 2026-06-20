alter table if exists appointment.appointments
    add constraint appointment_timeslot_id_constraint
    foreign key (timeslot_id)
    references appointment.timeslots;