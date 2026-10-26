CREATE TABLE IF NOT EXISTS teacher_absences (
    absence_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    absence_date DATE NOT NULL,
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_absence_date (teacher_id, absence_date)
);
