alter table if exists appointment.appointments
    add constraint FK9jpx797ytvnqjpd9v3i4e9n8l
    foreign key (timeslot_id)
    references appointment.timeslots