-- Demo campus data. Run schema.sql first.
-- All demo users use password: password

INSERT INTO users (first_name, last_name, email, mobile_number, password_hash, role) VALUES
('System', 'Admin', 'admin@schedulix.edu', '9999999990', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'ADMIN'),
('Aarav', 'Sharma', 'aarav.sharma@schedulix.edu', '9999999901', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Meera', 'Iyer', 'meera.iyer@schedulix.edu', '9999999902', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Rohan', 'Patel', 'rohan.patel@schedulix.edu', '9999999903', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Nisha', 'Verma', 'nisha.verma@schedulix.edu', '9999999904', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Vikram', 'Rao', 'vikram.rao@schedulix.edu', '9999999905', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Kavya', 'Nair', 'kavya.nair@schedulix.edu', '9999999906', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Aditya', 'Kulkarni', 'aditya.kulkarni@schedulix.edu', '9999999907', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Farah', 'Khan', 'farah.khan@schedulix.edu', '9999999908', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'FACULTY'),
('Ishaan', 'Joshi', 'ishaan.joshi@student.edu', '9999999910', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'STUDENT'),
('Ananya', 'Desai', 'ananya.desai@student.edu', '9999999911', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'STUDENT'),
('Kabir', 'Singh', 'kabir.singh@student.edu', '9999999912', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'STUDENT'),
('Sara', 'Thomas', 'sara.thomas@student.edu', '9999999913', '$2y$12$CYlgl2ecwJWMyoW7WGhP9u0/Xea4i7X1Cr3hpB7PeeTHIkoQL8r9K', 'STUDENT');

INSERT INTO departments (department_name) VALUES
('Computer Science and Engineering'),
('Information Technology'),
('Electronics and Communication');

INSERT INTO teachers (user_id, department_id, employee_id, designation, employment_type) VALUES
(2, 1, 'CSE-001', 'Professor', 'FULL_TIME'),
(3, 1, 'CSE-002', 'Associate Professor', 'FULL_TIME'),
(4, 1, 'CSE-003', 'Assistant Professor', 'FULL_TIME'),
(5, 2, 'IT-001', 'Professor', 'FULL_TIME'),
(6, 2, 'IT-002', 'Assistant Professor', 'FULL_TIME'),
(7, 2, 'IT-003', 'Assistant Professor', 'PART_TIME'),
(8, 3, 'ECE-001', 'Professor', 'FULL_TIME'),
(9, 3, 'ECE-002', 'Assistant Professor', 'FULL_TIME');

INSERT INTO sections (section_name, semester, academic_year, department_id, student_capacity) VALUES
('CSE-A', 1, '2026-27', 1, 45),
('CSE-B', 3, '2026-27', 1, 42),
('IT-A', 5, '2026-27', 2, 45),
('ECE-A', 6, '2026-27', 3, 40);

INSERT INTO students (user_id, roll_number, section_id, admission_year) VALUES
(10, '26CSE001', 1, 2026), (11, '26CSE002', 1, 2026),
(12, '25CSE031', 2, 2025), (13, '24IT021', 3, 2024);

INSERT INTO subjects (subject_code, subject_name, semester, credits, subject_type, lectures_per_week, required_room_type) VALUES
('CS101', 'Programming Fundamentals', 1, 4, 'THEORY', 3, 'CLASSROOM'),
('CS102', 'Discrete Mathematics', 1, 4, 'THEORY', 3, 'CLASSROOM'),
('CS103', 'Digital Logic', 1, 3, 'THEORY', 2, 'CLASSROOM'),
('CS104', 'Programming Fundamentals Lab', 1, 2, 'PRACTICAL', 2, 'LAB'),
('CS201', 'Data Structures', 3, 4, 'THEORY', 3, 'CLASSROOM'),
('CS202', 'Database Management Systems', 3, 4, 'THEORY', 3, 'CLASSROOM'),
('CS203', 'Computer Networks', 3, 3, 'THEORY', 2, 'CLASSROOM'),
('CS204', 'Data Structures Lab', 3, 2, 'PRACTICAL', 2, 'LAB'),
('IT301', 'Web Technologies', 5, 4, 'THEORY', 3, 'CLASSROOM'),
('IT302', 'Cloud Computing', 5, 3, 'THEORY', 2, 'CLASSROOM'),
('IT303', 'Software Engineering', 5, 3, 'THEORY', 2, 'CLASSROOM'),
('IT304', 'Web Technologies Lab', 5, 2, 'PRACTICAL', 2, 'LAB'),
('EC401', 'Embedded Systems', 6, 4, 'THEORY', 3, 'CLASSROOM'),
('EC402', 'Digital Signal Processing', 6, 4, 'THEORY', 3, 'CLASSROOM'),
('EC403', 'Wireless Communication', 6, 3, 'THEORY', 2, 'CLASSROOM'),
('EC404', 'Embedded Systems Lab', 6, 2, 'PRACTICAL', 2, 'LAB');

INSERT INTO subject_sections (subject_id, section_id) VALUES
(1,1),(2,1),(3,1),(4,1),
(5,2),(6,2),(7,2),(8,2),
(9,3),(10,3),(11,3),(12,3),
(13,4),(14,4),(15,4),(16,4);

INSERT INTO classrooms (room_number, building, floor, capacity, room_type, status) VALUES
('A-101', 'Main Block', 1, 60, 'CLASSROOM', 'AVAILABLE'),
('A-201', 'Main Block', 2, 50, 'CLASSROOM', 'AVAILABLE'),
('B-101', 'Science Block', 1, 45, 'CLASSROOM', 'AVAILABLE'),
('B-202', 'Science Block', 2, 60, 'CLASSROOM', 'AVAILABLE'),
('LAB-1', 'Technology Block', 1, 45, 'LAB', 'AVAILABLE'),
('LAB-2', 'Technology Block', 1, 45, 'LAB', 'AVAILABLE'),
('LAB-3', 'Technology Block', 2, 60, 'LAB', 'AVAILABLE'),
('SEM-1', 'Main Block', 3, 80, 'SEMINAR', 'AVAILABLE');

-- Monday and Tuesday: 09:00-18:00, with lunch break.
INSERT INTO time_slots (day, slot_number, start_time, end_time, is_break) VALUES
('MONDAY',1,'09:00:00','10:00:00',FALSE),('MONDAY',2,'10:00:00','11:00:00',FALSE),
('MONDAY',3,'11:00:00','12:00:00',FALSE),('MONDAY',4,'12:00:00','13:00:00',FALSE),
('MONDAY',5,'13:00:00','14:00:00',TRUE),('MONDAY',6,'14:00:00','15:00:00',FALSE),
('MONDAY',7,'15:00:00','16:00:00',FALSE),('MONDAY',8,'16:00:00','17:00:00',FALSE),
('MONDAY',9,'17:00:00','18:00:00',FALSE),
('TUESDAY',1,'09:00:00','10:00:00',FALSE),('TUESDAY',2,'10:00:00','11:00:00',FALSE),
('TUESDAY',3,'11:00:00','12:00:00',FALSE),('TUESDAY',4,'12:00:00','13:00:00',FALSE),
('TUESDAY',5,'13:00:00','14:00:00',TRUE),('TUESDAY',6,'14:00:00','15:00:00',FALSE),
('TUESDAY',7,'15:00:00','16:00:00',FALSE),('TUESDAY',8,'16:00:00','17:00:00',FALSE),
('TUESDAY',9,'17:00:00','18:00:00',FALSE);

-- Wednesday to Saturday: 08:00-16:00, with lunch break.
INSERT INTO time_slots (day, slot_number, start_time, end_time, is_break) VALUES
('WEDNESDAY',1,'08:00:00','09:00:00',FALSE),('WEDNESDAY',2,'09:00:00','10:00:00',FALSE),
('WEDNESDAY',3,'10:00:00','11:00:00',FALSE),('WEDNESDAY',4,'11:00:00','12:00:00',FALSE),
('WEDNESDAY',5,'12:00:00','13:00:00',TRUE),('WEDNESDAY',6,'13:00:00','14:00:00',FALSE),
('WEDNESDAY',7,'14:00:00','15:00:00',FALSE),('WEDNESDAY',8,'15:00:00','16:00:00',FALSE),
('THURSDAY',1,'08:00:00','09:00:00',FALSE),('THURSDAY',2,'09:00:00','10:00:00',FALSE),
('THURSDAY',3,'10:00:00','11:00:00',FALSE),('THURSDAY',4,'11:00:00','12:00:00',FALSE),
('THURSDAY',5,'12:00:00','13:00:00',TRUE),('THURSDAY',6,'13:00:00','14:00:00',FALSE),
('THURSDAY',7,'14:00:00','15:00:00',FALSE),('THURSDAY',8,'15:00:00','16:00:00',FALSE),
('FRIDAY',1,'08:00:00','09:00:00',FALSE),('FRIDAY',2,'09:00:00','10:00:00',FALSE),
('FRIDAY',3,'10:00:00','11:00:00',FALSE),('FRIDAY',4,'11:00:00','12:00:00',FALSE),
('FRIDAY',5,'12:00:00','13:00:00',TRUE),('FRIDAY',6,'13:00:00','14:00:00',FALSE),
('FRIDAY',7,'14:00:00','15:00:00',FALSE),('FRIDAY',8,'15:00:00','16:00:00',FALSE),
('SATURDAY',1,'08:00:00','09:00:00',FALSE),('SATURDAY',2,'09:00:00','10:00:00',FALSE),
('SATURDAY',3,'10:00:00','11:00:00',FALSE),('SATURDAY',4,'11:00:00','12:00:00',FALSE),
('SATURDAY',5,'12:00:00','13:00:00',TRUE),('SATURDAY',6,'13:00:00','14:00:00',FALSE),
('SATURDAY',7,'14:00:00','15:00:00',FALSE),('SATURDAY',8,'15:00:00','16:00:00',FALSE);

INSERT INTO teacher_availability (teacher_id, time_slot_id, day, is_available)
SELECT t.teacher_id, s.time_slot_id, s.day, TRUE
FROM teachers t CROSS JOIN time_slots s
WHERE s.is_break = FALSE;

INSERT INTO scheduling_constraints (constraint_type, constraint_name, description, is_hard_constraint, priority) VALUES
('TEACHER_UNAVAILABLE', 'Teacher availability', 'A teacher cannot be assigned outside declared availability.', TRUE, 1),
('ROOM_CAPACITY', 'Room capacity', 'A classroom must fit the section strength.', TRUE, 1),
('ROOM_TYPE', 'Room type', 'Practical subjects require laboratories and theory uses classrooms.', TRUE, 1),
('TEACHER_CONFLICT', 'Teacher conflict', 'A teacher cannot teach two sections in the same slot.', TRUE, 1),
('SECTION_CONFLICT', 'Section conflict', 'A section cannot attend two classes in the same slot.', TRUE, 1),
('CONSECUTIVE_LECTURES', 'Balanced day', 'Avoid unnecessary consecutive lectures where alternatives exist.', FALSE, 2);

-- Two saved finalized schedules for testing the timetable history and viewer.
-- Generation 1 belongs to CSE-A (semester 1); generation 2 belongs to CSE-B (semester 3).
INSERT INTO timetable_generations
    (section_id, semester, academic_year, generated_by, status, algorithm, execution_time_ms)
VALUES
    (1, 1, '2026-27', 1, 'SUCCESS', 'SEEDED_REALISTIC', 820),
    (2, 3, '2026-27', 1, 'SUCCESS', 'SEEDED_REALISTIC', 910);

INSERT INTO timetable
    (generation_id, subject_id, teacher_id, classroom_id, time_slot_id, section_id)
VALUES
    -- CSE-A: six classes per day, Monday through Saturday (lunch is slot 5).
    (1,1,1,1,1,1),(1,2,2,2,2,1),(1,3,3,3,3,1),(1,4,1,5,4,1),(1,1,1,1,6,1),(1,2,2,2,7,1),
    (1,2,2,2,10,1),(1,3,3,3,11,1),(1,1,1,1,12,1),(1,4,1,5,13,1),(1,2,2,2,15,1),(1,3,3,3,16,1),
    (1,3,3,3,19,1),(1,1,1,1,20,1),(1,2,2,2,21,1),(1,4,1,5,22,1),(1,3,3,3,24,1),(1,1,1,1,25,1),
    (1,1,1,1,27,1),(1,2,2,2,28,1),(1,3,3,3,29,1),(1,4,1,5,30,1),(1,1,1,1,32,1),(1,2,2,2,33,1),
    (1,2,2,2,35,1),(1,3,3,3,36,1),(1,1,1,1,37,1),(1,4,1,5,38,1),(1,2,2,2,40,1),(1,3,3,3,41,1),
    (1,3,3,3,43,1),(1,1,1,1,44,1),(1,2,2,2,45,1),(1,4,1,5,46,1),(1,3,3,3,48,1),(1,1,1,1,49,1),
    -- CSE-B: six classes per day, Monday through Saturday (a second section timetable).
    (2,5,1,1,1,2),(2,6,2,2,2,2),(2,7,3,3,3,2),(2,8,1,5,4,2),(2,5,1,1,6,2),(2,6,2,2,7,2),
    (2,6,2,2,10,2),(2,7,3,3,11,2),(2,5,1,1,12,2),(2,8,1,5,13,2),(2,6,2,2,15,2),(2,7,3,3,16,2),
    (2,7,3,3,19,2),(2,5,1,1,20,2),(2,6,2,2,21,2),(2,8,1,5,22,2),(2,7,3,3,24,2),(2,5,1,1,25,2),
    (2,5,1,1,27,2),(2,6,2,2,28,2),(2,7,3,3,29,2),(2,8,1,5,30,2),(2,5,1,1,32,2),(2,6,2,2,33,2),
    (2,6,2,2,35,2),(2,7,3,3,36,2),(2,5,1,1,37,2),(2,8,1,5,38,2),(2,6,2,2,40,2),(2,7,3,3,41,2),
    (2,7,3,3,43,2),(2,5,1,1,44,2),(2,6,2,2,45,2),(2,8,1,5,46,2),(2,7,3,3,48,2),(2,5,1,1,49,2);
