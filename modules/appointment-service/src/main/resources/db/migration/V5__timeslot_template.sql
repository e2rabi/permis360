INSERT INTO appointment.availability_template
(id,provider_id, day_of_week, start_time, end_time, slot_duration, capacity, active)
VALUES
    (nextval('appointment.availability_template_sequence'),2, 'MONDAY',    '09:00', '16:00', 60, 1, true),
    (nextval('appointment.availability_template_sequence'),2, 'TUESDAY',   '09:00', '16:00', 60, 1, true),
    (nextval('appointment.availability_template_sequence'),2, 'WEDNESDAY', '09:00', '16:00', 60, 1, true),
    (nextval('appointment.availability_template_sequence'),2, 'THURSDAY',  '09:00', '16:00', 60, 1, true);