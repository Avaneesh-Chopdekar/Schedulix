-- Academic Management

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,

    department_name VARCHAR(100) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_department_name
        CHECK (CHAR_LENGTH(TRIM(department_name)) >= 2)
);

-- Resource Management



-- Scheduling
