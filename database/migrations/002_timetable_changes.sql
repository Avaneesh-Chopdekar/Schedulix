CREATE TABLE IF NOT EXISTS timetable_changes (
    change_id INT AUTO_INCREMENT PRIMARY KEY,
    timetable_id INT NOT NULL,
    generation_id INT NOT NULL,
    changed_by INT NOT NULL,
    old_values JSON NOT NULL,
    new_values JSON NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (timetable_id) REFERENCES timetable(timetable_id) ON DELETE CASCADE,
    FOREIGN KEY (generation_id) REFERENCES timetable_generations(generation_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
);
