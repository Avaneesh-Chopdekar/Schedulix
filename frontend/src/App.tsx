import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import AuthPage from "./pages/auth/AuthPage";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Teachers from "./pages/admin/Teachers";
import AddTeacher from "./pages/admin/AddTeacher";
import Subjects from "./pages/admin/Subjects";
import AddSubject from "./pages/admin/AddSubject";
import Classrooms from "./pages/admin/Classrooms";
import AddClassroom from "./pages/admin/AddClassroom";
import TimeSlots from "./pages/admin/TimeSlots";
import AddTimeSlot from "./pages/admin/AddTimeSlot";
import Sections from "./pages/admin/Sections";
import AddSection from "./pages/admin/AddSection";
import Students from "./pages/admin/Students";
import AddStudent from "./pages/admin/AddStudent";
import TeacherAvailability from "./pages/admin/TeacherAvailability";
import AddTeacherAvailability from "./pages/admin/AddTeacherAvailability";
import SubjectSections from "./pages/admin/SubjectSections";
import AddSubjectSection from "./pages/admin/AddSubjectSection";
import Timetable from "./pages/admin/Timetable";
import FinalizedTimetables from "./pages/admin/FinalizedTimetables";
import EditTimetable from "./pages/admin/EditTimetable";
import TeachingAssignments from "./pages/admin/TeachingAssignments";

// Faculty
import FacultyDashboard from "./pages/faculty/FacultyDashboard";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />

      {/* ========================= AUTH ========================= */}

      <Route path="/auth/login" element={<AuthPage />} />

      <Route path="/auth/register" element={<AuthPage />} />

      {/* Backward-compatible public auth URLs. */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      <Route
        path="/register"
        element={<Navigate to="/auth/register" replace />}
      />

      {/* ================= ADMIN ================= */}

      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="teachers" element={<Teachers />} />

          <Route path="teachers/add" element={<AddTeacher />} />

          <Route path="teachers/edit/:id" element={<AddTeacher />} />

          <Route path="subjects" element={<Subjects />} />

          <Route path="subjects/add" element={<AddSubject />} />

          <Route path="subjects/edit/:id" element={<AddSubject />} />

          <Route path="classrooms" element={<Classrooms />} />

          <Route path="classrooms/add" element={<AddClassroom />} />

          <Route path="classrooms/edit/:id" element={<AddClassroom />} />

          <Route path="timeslots" element={<TimeSlots />} />

          <Route path="timeslots/add" element={<AddTimeSlot />} />

          <Route path="timeslots/edit/:id" element={<AddTimeSlot />} />

          <Route path="sections" element={<Sections />} />
          <Route path="sections/add" element={<AddSection />} />
          <Route path="sections/edit/:id" element={<AddSection />} />

          <Route path="students" element={<Students />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<AddStudent />} />

          <Route path="teacher-availability" element={<TeacherAvailability />} />
          <Route path="teacher-availability/add" element={<AddTeacherAvailability />} />
          <Route path="teacher-availability/edit/:id" element={<AddTeacherAvailability />} />

          <Route path="subject-sections" element={<SubjectSections />} />
          <Route path="subject-sections/add" element={<AddSubjectSection />} />
          <Route path="subject-sections/edit/:id" element={<AddSubjectSection />} />

          <Route path="timetable" element={<Timetable />} />
          <Route path="timetable/finalized" element={<FinalizedTimetables />} />
          <Route path="teaching-assignments" element={<TeachingAssignments />} />

          <Route path="timetable/edit/:id" element={<EditTimetable />} />

          {/*<Route path="timetable/edit/:id" element={<EditTimetableEntry />} />*/}
        </Route>
      </Route>

      {/* ================= FACULTY ================= */}

      <Route element={<ProtectedRoute requiredRole="FACULTY" />}>
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      </Route>

      {/* ================= STUDENT ================= */}

      <Route element={<ProtectedRoute requiredRole="STUDENT" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>

      {/* ================= 404 ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
