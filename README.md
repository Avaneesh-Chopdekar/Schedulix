# Schedulix

**Schedulix** is an intelligent, constraint-based academic timetable management and scheduling system. Built to solve high-complexity scheduling challenges in colleges and universities, Schedulix automates the allocation of lectures, faculty members, and classrooms while eliminating scheduling conflicts (faculty overlaps, classroom clashes, room type mismatches, and capacity violations).

Developed as an MCA academic project by **Avaneesh Chopdekar**, **Vanshaj Madeshiya**, and **Harshal Yadav**.

---

## 🌟 Key Highlights & Engineering Challenges

Traditional timetable creation involves combinatorially complex constraints and tedious manual effort. Schedulix solves this with:

- **Constraint-Based Scheduling Engine**: Implements deterministic and randomized greedy heuristic algorithms with in-memory occupancy tracking for conflict-free scheduling.
- **Zero-Overlap Guarantee**: Enforces hard constraints preventing faculty double-booking, room clashes, and section lecture collisions.
- **Resource Optimization**: Matches subject requirements (theory vs. practical lab sessions) with suitable classroom types (`CLASSROOM`, `LAB`, `SEMINAR`) and verifies room capacity against student enrollment.
- **Role-Based Access Control (RBAC)**: Distinct dashboards and capabilities for **Admin**, **Faculty**, and **Student** roles.
- **Dynamic Availability & Absence Handling**: Incorporates faculty availability schedules and absence notifications into scheduling logic.
- **Audit & Change Tracking**: Tracks timetable modifications and generation histories across academic semesters.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Material UI (MUI v9+), Emotion (`@emotion/react`, `@emotion/styled`)
- **Icons**: `@mui/icons-material`
- **Routing**: React Router v7 (`react-router-dom`)
- **Forms**: React Hook Form
- **Theme**: Custom Theme Provider (Dark / Light mode support)

### Backend

- **Language**: PHP 8.2+
- **Architecture**: 3-Tier Layered Architecture (Controllers → Services → Repositories → Models)
- **Framework**: Slim Framework 4 (PSR-7 / PSR-15 micro-framework)
- **HTTP Engine**: `slim/psr7`
- **Environment Management**: `vlucas/phpdotenv`
- **Authentication**: Token-based session authentication with custom `AuthMiddleware` and `RoleMiddleware`

### Database

- **Engine**: MySQL 8.0+
- **Design**: Fully normalized relational schema (17 tables with foreign key cascades and integrity constraints)
- **Migrations**: Incremental SQL migrations (`database/migrations/`)

---

## 📁 Project Structure

```
Schedulix/
│
├── frontend/                     # React 19 + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── assets/               # Static assets & icons
│   │   ├── components/           # Reusable UI components (Navbar, Sidebar, ThemeToggle, etc.)
│   │   ├── context/              # React Contexts (AuthContext, ThemeContext)
│   │   ├── layouts/              # DashboardLayout and PublicLayout
│   │   ├── pages/
│   │   │   ├── admin/            # Admin CRUD & Timetable management pages
│   │   │   ├── faculty/          # Faculty dashboard & schedule views
│   │   │   ├── student/          # Student dashboard & class timetables
│   │   │   └── auth/             # Login, Register, Password Reset pages
│   │   ├── services/             # Axios/fetch API clients (authApi, crudApi)
│   │   ├── utils/                # Helper utilities & mock data fallbacks
│   │   ├── App.tsx               # Root route declarations & RBAC protection
│   │   └── main.tsx              # React DOM entrypoint & theme wrappers
│   ├── package.json
│   └── vite.config.ts
│
├── server/                       # Slim 4 REST API Backend (PHP 8)
│   ├── api/
│   │   ├── index.php             # API entry point & Slim initialization
│   │   └── routes.php            # REST route declarations
│   ├── config/
│   │   ├── database.php          # PDO database connection configuration
│   │   └── auth.php              # Auth & session security settings
│   ├── controllers/              # HTTP request & response handlers
│   ├── middleware/               # AuthMiddleware, RoleMiddleware
│   ├── models/                   # Domain entities & data transfer objects
│   ├── repositories/             # PDO-based SQL data persistence layer
│   ├── services/                 # Core business logic & TimetableGenerationService
│   └── composer.json             # PHP dependencies
│
├── database/                     # Database setup & versioning
│   ├── schema.sql                # Complete baseline DDL schema
│   ├── seed.sql                  # Comprehensive demo & testing dataset
│   └── migrations/               # Incremental schema migration scripts
│
├── docs/                         # Project documentation, SRS, ERD diagrams
│   └── Schedulix.docx            # Detailed academic project documentation
│
└── README.md
```

---

## ⚡ Core Modules & Features

### 1. Authentication & Security

- Secure token-based session management (`users`, `user_sessions`).
- Role-Based Access Control (`ADMIN`, `FACULTY`, `STUDENT`).
- Password reset token flow (`password_reset_tokens`).

### 2. Academic & Resource Management

- **Departments & Programs**: Manage academic divisions.
- **Faculty Management**: Track employee designations, employment types, and departments.
- **Student & Section Directory**: Student enrollment by section, semester, and academic year.
- **Subject Catalog**: Subject codes, lecture counts per week, credit weightage, and type (`THEORY` vs. `PRACTICAL`).
- **Subject-Section Mapping**: Assign which sections study which subjects.
- **Classroom Allocation**: Capacity tracking and specialized room types (`CLASSROOM`, `LAB`, `SEMINAR`).
- **Time Slots**: Configurable periods per day, day-wise slots, and break markers.

### 3. Constraint-Based Timetable Generation

- **Automated Scheduler**:
  - Deterministic Greedy Heuristic (balances weekday distribution).
  - Randomized Greedy Heuristic (supports varied seeds for alternate generation options).
- **Hard Constraints Enforced**:
  1. **Teacher Conflict**: A faculty member cannot teach two lectures simultaneously.
  2. **Room Conflict**: A room cannot host more than one session at a time.
  3. **Room Capability**: Practical/Lab subjects must strictly be scheduled in laboratory rooms.
  4. **Capacity Validation**: Classroom capacity must accommodate section student size.
  5. **Faculty Availability**: Honors predefined teacher availability slots and active absence records.
  6. **Section Overlap**: A student section cannot have overlapping lectures.

### 4. Interactive Timetable Operations

- **Interactive Grid**: Weekly visual grid display categorized by days and time slots.
- **Manual Adjustment & Overrides**: Admins can edit generated allocations to accommodate edge cases.
- **Audit Trail**: Real-time logging of manual timetable modifications (`timetable_changes`).
- **Targeted Views**: Personalized views tailored for students and individual faculty members.

---

## 🔌 API Reference Overview

| Endpoint                     | Method                         | Role          | Description                                     |
| ---------------------------- | ------------------------------ | ------------- | ----------------------------------------------- |
| `/api/health`                | `GET`                          | Public        | System health check                             |
| `/api/auth/login`            | `POST`                         | Public        | Authenticate user & issue session token         |
| `/api/auth/register`         | `POST`                         | Public        | Register new user account                       |
| `/api/auth/me`               | `GET`                          | Authenticated | Fetch active user session profile               |
| `/api/auth/logout`           | `POST`                         | Authenticated | Invalidate active user session                  |
| `/api/departments`           | `GET`, `POST`                  | Admin         | Manage academic departments                     |
| `/api/teachers`              | `GET`, `POST`, `PUT`, `DELETE` | Admin         | Manage faculty records                          |
| `/api/students`              | `GET`, `POST`, `PUT`, `DELETE` | Admin         | Manage student profiles & section links         |
| `/api/sections`              | `GET`, `POST`, `PUT`, `DELETE` | Admin         | Manage academic sections & capacities           |
| `/api/subjects`              | `GET`, `POST`, `PUT`, `DELETE` | Admin         | Manage course subjects & room requirements      |
| `/api/subject-sections`      | `GET`, `POST`, `DELETE`        | Admin         | Map subjects to sections                        |
| `/api/classrooms`            | `GET`, `POST`, `PUT`, `DELETE` | Admin         | Manage classrooms, types, and capacities        |
| `/api/time-slots`            | `GET`, `POST`, `PUT`, `DELETE` | Admin         | Configure academic periods & breaks             |
| `/api/teacher-availability`  | `GET`, `POST`, `PUT`, `DELETE` | Admin/Faculty | Set faculty available time slots                |
| `/api/teacher-absences`      | `GET`, `POST`                  | Admin/Faculty | Log faculty leaves & unavailability             |
| `/api/timetable/generate`    | `POST`                         | Admin         | Execute constraint-based timetable generation   |
| `/api/timetable/generations` | `GET`, `DELETE`                | Admin         | View history of generated timetable runs        |
| `/api/timetable`             | `GET`, `POST`, `PUT`, `DELETE` | Authenticated | Read, create, update, or remove timetable cells |
| `/api/timetable/changes`     | `GET`                          | Admin         | Audit trail of manual schedule modifications    |

---

## 🚀 Installation & Local Setup

### Prerequisites

- **Node.js**: v20.x or later & `npm`
- **PHP**: v8.2 or higher with `pdo_mysql` extension enabled
- **Composer**: PHP dependency manager
- **Database**: MySQL 8.0+ (or MariaDB 10.5+)
- **Web Server** _(Optional)_: Apache / XAMPP or PHP built-in CLI server

---

### 1. Database Setup

1. Start your MySQL service.
2. Create the database:
   ```sql
   CREATE DATABASE schedulix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import the base schema and initial seeds:
   ```bash
   mysql -u root -p schedulix < database/schema.sql
   mysql -u root -p schedulix < database/seed.sql
   ```
4. Apply any pending incremental migrations:
   ```bash
   for file in database/migrations/*.sql; do
       mysql -u root -p schedulix < "$file"
   done
   ```

---

### 2. Backend Setup (Server)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Configure environment variables by creating `.env` in `server/`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=schedulix
   DB_USER=root
   DB_PASS=your_password
   APP_ENV=development
   ```
4. Start the backend server:
   ```bash
   # Using PHP's built-in development server:
   php -S 127.0.0.1:8000 -t api
   ```
   _The API will be available at `http://127.0.0.1:8000/api`._

---

### 3. Frontend Setup (Client)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 📊 Project Status

- [x] Requirement Analysis & SRS
- [x] Relational Database Modeling & ER Diagrams
- [x] Normalized MySQL Schema & Migration Scripts
- [x] Slim Framework 4 Backend REST APIs
- [x] Role-Based Access Control (Admin, Faculty, Student)
- [x] React 19 + TypeScript + MUI Responsive Dashboard
- [x] Constraint-Based Greedy Timetable Generation Engine
- [x] Manual Timetable Editor & Conflict Audit Logging
- [x] Faculty Absence & Availability Management
- [x] Academic Project Documentation

---

## 👥 Contributors

- **Avaneesh Chopdekar** ([@Avaneesh-Chopdekar](https://github.com/Avaneesh-Chopdekar))
- **Vanshaj Madeshiya** ([@VANSSSH](https://github.com/VANSSSH))
- **Harshal Yadav** ([@yharryshall](https://github.com/yharryshall))

---

## 📄 License & Acknowledgements

Developed as part of the Master of Computer Applications (MCA) academic curriculum.  
Special thanks to academic project guides, faculty mentors, and the open-source software community.
