-- Run this once against databases created before subject_section_id was added.
ALTER TABLE subject_sections
    DROP PRIMARY KEY,
    ADD COLUMN subject_section_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST,
    ADD UNIQUE KEY unique_subject_section (subject_id, section_id);
