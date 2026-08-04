```markdown
# Schedulix

**Schedulix** is a constraint-based smart college timetable management system designed to simplify the process of creating and managing academic timetables. The application helps educational institutions reduce manual scheduling efforts while preventing common conflicts such as faculty overlaps, classroom clashes, and invalid resource allocations.

This project is being developed as part of an MCA academic project using **React**, **Core PHP**, and **MySQL**.

---

## Features

### Authentication
- User login
- Role-based access (Admin, Faculty, Student)
- Session management

### Academic Management
- Manage Departments
- Manage Programs
- Manage Semesters
- Manage Teachers
- Manage Subjects
- Assign Subjects to Teachers

### Resource Management
- Manage Classrooms
- Manage Laboratories
- Define Room Capacity
- Manage Resource Availability

### Timetable Management
- Create semester timetables
- Assign lectures to faculty
- Allocate classrooms
- Manage lecture time slots
- View faculty timetable
- View student timetable

### Constraint Validation
The system validates scheduling constraints before saving a timetable.

Examples include:

- A faculty member cannot teach two lectures at the same time.
- A classroom cannot host multiple lectures simultaneously.
- Laboratory subjects can only be assigned to laboratory rooms.
- Classroom capacity must be sufficient for the class.
- Faculty availability is respected.
- Semester lectures cannot overlap.

---

## Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- Bootstrap / Material CSS / Tailwind CSS
- JavaScript

### Backend
- Core PHP (REST APIs)

### Database
- MySQL

### Development Tools
- Visual Studio Code
- XAMPP
- Git
- GitHub
- Postman

---

## Project Structure

```

schedulix/
│
├── client/                 # React Frontend
│
├── server/
│   ├── api/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   └── routes/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── SRS.pdf
│   ├── ERD.pdf
│   └── Diagrams/
│
├── README.md
│
└── .gitignore

````

---

## Database Modules

### User Module
- Users
- Roles

### Academic Module
- Departments
- Programs
- Semesters
- Teachers
- Subjects
- TeacherSubject Mapping

### Resource Module
- Buildings
- Classrooms
- Laboratories

### Timetable Module
- Timetables
- Time Slots
- Lectures
- Scheduling Constraints

---

## Engineering Challenges

This project focuses on solving real-world scheduling problems rather than only implementing CRUD operations.

The system addresses:

- Scheduling conflicts
- Resource optimization
- Faculty availability validation
- Classroom allocation
- Constraint-based timetable generation
- Timetable consistency
- Data normalization

---

## Future Enhancements

- Automatic timetable generation using backtracking or greedy algorithms
- Drag-and-drop timetable editor
- Email notifications
- PDF timetable export
- Attendance integration
- Calendar synchronization
- Multi-campus support
- Analytics dashboard

---

## Installation

### Prerequisites

- PHP 8+
- MySQL 8+
- Node.js 20+
- npm
- XAMPP (or Apache + PHP)
- Git

### Clone Repository

```bash
git clone https://github.com/Avaneesh-Chopdekar/Schedulix.git
````

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

Move the `server` folder to your XAMPP `htdocs` directory (or configure Apache accordingly).

Example:

```
xampp/htdocs/schedulix/server/
```

Create a MySQL database.

Import:

```
database/schema.sql
```

Update your database configuration:

```
server/config/database.php
```

Start Apache and MySQL.

---

## API Modules

```
/api/auth
/api/users
/api/teachers
/api/departments
/api/programs
/api/semesters
/api/subjects
/api/classrooms
/api/timeslots
/api/timetable
```

---

## Project Status

Current Phase:

* [x] Project Planning
* [x] Software Requirements Specification
* [x] Entity Relationship Diagram
* [ ] Database Implementation
* [ ] Backend APIs
* [ ] React Frontend
* [ ] Constraint Validation Engine
* [ ] Timetable Generation
* [ ] Testing
* [ ] Documentation

---

## Contributors

* Avaneesh Chopdekar
* Vanshaj Madeshiya
* Harshal Yadav

---

## License

This project is developed for academic purposes as part of the MCA curriculum.

---

## Acknowledgements

* Faculty members for project guidance
* Open-source community
* React
* PHP
* MySQL

```
```
