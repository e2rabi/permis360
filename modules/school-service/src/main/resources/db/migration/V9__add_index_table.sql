CREATE INDEX idx_school_id ON school.schools(id);
CREATE INDEX idx_school_email ON school.schools(email);

CREATE INDEX idx_student_email ON school.students(email);
CREATE INDEX idx_student_school_id ON school.students(school_id);