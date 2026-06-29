INSERT INTO appointment.timeslots (id,school_id, instructor_id, start_time, end_time, max_capacity)
VALUES
( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 08:00:00', '2026-06-29 09:00:00', 5),
( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 09:00:00', '2026-06-29 10:00:00', 5),
( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 10:00:00', '2026-06-29 11:00:00', 5),
( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 11:00:00', '2026-06-29 12:00:00', 5);

-- Insert time slots for afternoon session (14:00 PM - 18:00 PM)
INSERT INTO appointment.timeslots (id,school_id, instructor_id, start_time, end_time, max_capacity)
VALUES
    ( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 14:00:00', '2026-06-29 15:00:00', 5),
    ( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 15:00:00', '2026-06-29 16:00:00', 5),
    ( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 16:00:00', '2026-06-29 17:00:00', 5),
    ( nextval('appointment.timeslot_sequence'), 1, null, '2026-06-29 17:00:00', '2026-06-29 18:00:00', 5);
