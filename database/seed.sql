INSERT INTO users (first_name, last_name, email, mobile_number, password_hash, role) VALUES
('System', 'Admin', 'admin@schedulix.edu', '9999999990', 'hashed_pw_123', 'ADMIN'),
('Alan', 'Turing', 'aturing@schedulix.edu', '9999999991', 'hashed_pw_123', 'FACULTY'),
('Ada', 'Lovelace', 'alovelace@schedulix.edu', '9999999992', 'hashed_pw_123', 'FACULTY'),
('John', 'Doe', 'jdoe@student.edu', '9999999993', 'hashed_pw_123', 'STUDENT'),
('Jane', 'Smith', 'jsmith@student.edu', '9999999994', 'hashed_pw_123', 'STUDENT');

 
-- Insert Departments
INSERT INTO departments (department_name) VALUES
('Computer Science'),
('Information Technology');

 
-- Insert Teachers
INSERT INTO teachers (user_id, department_id, employee_id, designation, employment_type) VALUES
(2, 1, 'EMP-CS-001', 'Professor', 'FULL_TIME'),
(3, 2, 'EMP-IT-001', 'Assistant Professor', 'PART_TIME');

 
-- Insert Sections
INSERT INTO sections (section_name, semester, academic_year, department_id, student_capacity) VALUES
('CS-A', 5, '2026-2027', 1, 60),
('IT-A', 5, '2026-2027', 2, 60);

 
-- Insert Students
INSERT INTO students (user_id, roll_number, section_id, admission_year) VALUES
(4, '26CS001', 1, 2026),
(5, '26IT001', 2, 2026);

 
-- Insert Subjects
INSERT INTO subjects (subject_code, subject_name, semester, credits, subject_type, lectures_per_week, required_room_type) VALUES
('CS301', 'Data Structures', 5, 4, 'THEORY', 3, 'CLASSROOM'),
('IT301', 'Web Development', 5, 4, 'PRACTICAL', 2, 'LAB');

 
-- Assign Subjects to Sections
INSERT INTO subject_sections (subject_id, section_id) VALUES
(1, 1),
(2, 2);

 
-- Insert Classrooms
INSERT INTO classrooms (room_number, building, floor, capacity, room_type) VALUES
('101A', 'Main Block', 1, 65, 'CLASSROOM'),
('LAB-1', 'Tech Block', 2, 40, 'LAB');

 
-- Insert Time Slots
INSERT INTO time_slots (day, slot_number, start_time, end_time, is_break) VALUES
('MONDAY', 1, '09:00:00', '10:00:00', FALSE),
('MONDAY', 2, '10:00:00', '11:00:00', FALSE),
('MONDAY', 3, '11:00:00', '11:30:00', TRUE);

 
-- Insert Teacher Availability
INSERT INTO teacher_availability (teacher_id, time_slot_id, day, is_available) VALUES
(1, 1, 'MONDAY', TRUE),
(1, 2, 'MONDAY', FALSE),
(2, 1, 'MONDAY', TRUE);

 
-- Insert Scheduling Constraints
INSERT INTO scheduling_constraints (constraint_type, constraint_name, description, is_hard_constraint) VALUES
('TEACHER_CONFLICT', 'No Double Booking', 'A teacher cannot be in two places at the same time.', TRUE),
('ROOM_CAPACITY', 'Capacity Check', 'Students mapped to a section must not exceed room capacity.', TRUE);

-- Insert a Timetable Generation Record
INSERT INTO timetable_generations (section_id, semester, academic_year, generated_by, status, algorithm, execution_time_ms) VALUES
(1, 5, '2026-2027', 1, 'SUCCESS', 'GREEDY_V1', 1240);

-- Insert Final Timetable Record
INSERT INTO timetable (generation_id, subject_id, teacher_id, classroom_id, time_slot_id, section_id) VALUES
(1, 1, 1, 1, 1, 1);
 
-- Insert a Timetable Generation Record
INSERT INTO timetable_generations (section_id, semester, academic_year, generated_by, status, algorithm, execution_time_ms) VALUES
(1, 5, '2026-2027', 1, 'SUCCESS', 'GREEDY_V1', 1240);
 
-- Insert Final Timetable Record
INSERT INTO timetable (generation_id, subject_id, teacher_id, classroom_id, time_slot_id, section_id) VALUES
(1, 1, 1, 1, 1, 1);
 
