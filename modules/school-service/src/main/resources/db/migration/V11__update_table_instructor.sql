
alter table school.instructors  drop column specialty;
alter table school.instructors  add column cin varchar(255) unique ;
alter table school.instructors  add column licenseTypes varchar(255);
alter table school.instructors  add column authorizationNumber varchar(255);