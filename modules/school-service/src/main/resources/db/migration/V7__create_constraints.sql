alter table if exists school.instructors
    add constraint FKqxt2hlrm6lt9gtwmoqpuhy3xb
    foreign key (school_id)
    references school.schools;

alter table if exists school.lesson_slots
    add constraint FKcsqycgmp610tes12m8jmek87l
    foreign key (car_id)
    references school.cars;

alter table if exists school.lesson_slots
    add constraint FKwbe42mud94ikrbu0nlqt1gq6
    foreign key (instructor_id)
    references school.instructors;

alter table if exists school.lesson_slots
    add constraint FKb6jwr0kgp5vghd55i5fvop9oe
    foreign key (student_id)
    references school.students;

alter table if exists school.payments
    add constraint FK6ooq278k2bs5xi8t5o6oort1v
    foreign key (student_id)
    references school.students;

alter table if exists school.schools
    add constraint FKhq9ubexxbws5p19fk3sffnq2m
    foreign key (geo_location_id)
    references school.geo_location;

alter table if exists school.students
    add constraint FKdojmg8v3rw2ow4dev2b8q5oqq
    foreign key (school_id)
    references school.schools;