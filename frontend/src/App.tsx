import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Teachers from "./pages/admin/Teachers";
import AddTeacher from "./pages/admin/AddTeacher";
import Subjects from "./pages/admin/Subjects";
import AddSubject from "./pages/admin/AddSubject";
import Classrooms from "./pages/admin/Classrooms";
import AddClassroom from "./pages/admin/AddClassroom";
import TimeSlots from "./pages/admin/TimeSlots";
import Timetable from "./pages/admin/Timetable";

// Faculty
import FacultyDashboard from "./pages/faculty/FacultyDashboard";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}

      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="teachers" element={<Teachers />} />

        <Route path="teachers/add" element={<AddTeacher />} />

        <Route path="subjects" element={<Subjects />} />

        <Route path="subjects/add" element={<AddSubject />} />

        <Route path="subjects/edit/:id" element={<AddSubject />} />

        <Route path="classrooms" element={<Classrooms />} />

        <Route path="classrooms/add" element={<AddClassroom />} />

        <Route path="timeslots" element={<TimeSlots />} />

        <Route path="timetable" element={<Timetable />} />
      </Route>

      {/* ================= FACULTY ================= */}

      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

      {/* ================= STUDENT ================= */}

      <Route path="/student/dashboard" element={<StudentDashboard />} />

      {/* ================= 404 ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
