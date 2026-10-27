const API_BASE_URL = "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = (await response.json()) as {
    success?: boolean;
    message?: string;
    data?: T;
  };

  if (!response.ok || data.success === false) {
    throw new Error(data.message ?? "Request failed.");
  }

  return data.data as T;
}

export interface Subject {
  subject_id: number;
  subject_code: string;
  subject_name: string;
  semester: number;
  credits: number;
  subject_type: "THEORY" | "PRACTICAL";
  lectures_per_week: number;
  required_room_type: "CLASSROOM" | "LAB" | "SEMINAR";
}

export interface Classroom {
  classroom_id: number;
  room_number: string;
  building: string;
  floor: number;
  capacity: number;
  room_type: "CLASSROOM" | "LAB" | "SEMINAR";
  status: "AVAILABLE" | "OCCUPIED";
}

export interface TimeSlot {
  time_slot_id: number;
  day: string;
  slot_number: number;
  start_time: string;
  end_time: string;
  is_break: boolean;
}

export interface Section {
  section_id: number;
  section_name: string;
  semester: number;
  academic_year: string;
  department_id: number;
  student_capacity: number;
}

export interface Student {
  student_id: number;
  user_id: number;
  roll_number: string;
  section_id: number;
  admission_year: number;
}

export interface Department {
  department_id: number;
  department_name: string;
}

export interface TeacherAvailability {
  availability_id: number;
  teacher_id: number;
  time_slot_id: number;
  day: string;
  is_available: boolean;
}

export interface SubjectSection {
  subject_section_id: number;
  subject_id: number;
  section_id: number;
}

export interface TimetableEntry {
  timetable_id: number;
  generation_id: number;
  subject_id: number;
  teacher_id: number;
  classroom_id: number;
  time_slot_id: number;
  section_id: number;
}

export interface TimetableGeneration {
  generation_id: number;
  section_id: number;
  semester: number;
  academic_year: string;
  generated_by: number;
  status: "SUCCESS" | "FAILED";
  generated_at?: string;
}
export interface TimetableChange {
  change_id: number;
  timetable_id: number;
  generation_id: number;
  changed_by: number;
  old_values: string;
  new_values: string;
  changed_at: string;
}
export interface TeacherAbsence {
  absence_id: number;
  teacher_id: number;
  absence_date: string;
  reason: string | null;
  employee_id: string;
  first_name: string;
  last_name: string;
}
export const getTeacherAbsences = () => request<TeacherAbsence[]>("/api/teacher-absences");
export const markTeacherAbsent = (absence_date: string, reason?: string) =>
  request<{ absence_date: string }>("/api/teacher-absences", {
    method: "POST",
    body: JSON.stringify({ absence_date, reason }),
  });

export interface GenerateTimetableResult {
  generation_id: number;
  created_entries_count: number;
  unscheduled: Array<{ subject_id: number; occurrence: number; reason: string }>;
  randomized: boolean;
  random_seed: number | null;
}

export const getDepartments = () => request<Department[]>("/api/departments");
export const getSections = () => request<Section[]>("/api/sections");
export const getSection = (id: number) =>
  request<Section>(`/api/sections/${id}`);
export const createSection = (data: Omit<Section, "section_id">) =>
  request<Section>("/api/sections", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateSection = (id: number, data: Omit<Section, "section_id">) =>
  request<Section>(`/api/sections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteSection = (id: number) =>
  request<void>(`/api/sections/${id}`, { method: "DELETE" });

export const getStudents = () => request<Student[]>("/api/students");
export const getStudent = (id: number) => request<Student>(`/api/students/${id}`);
export const updateStudent = (id: number, data: Omit<Student, "student_id">) =>
  request<Student>(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteStudent = (id: number) =>
  request<void>(`/api/students/${id}`, { method: "DELETE" });

export interface Teacher {
  teacher_id: number;
  user_id: number;
  department_id: number;
  employee_id: string;
  designation: string;
  employment_type: string;
  first_name?: string;
  last_name?: string;
}

export const getTeachers = () => request<Teacher[]>("/api/teachers");
export const deleteTeacher = (id: number) =>
  request<void>(`/api/teachers/${id}`, { method: "DELETE" });

export const getTeacherAvailability = () =>
  request<TeacherAvailability[]>("/api/teacher-availability");
export const getTeacherAvailabilityById = (id: number) =>
  request<TeacherAvailability>(`/api/teacher-availability/${id}`);
export const createTeacherAvailability = (
  data: Omit<TeacherAvailability, "availability_id">,
) =>
  request<TeacherAvailability>("/api/teacher-availability", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateTeacherAvailability = (
  id: number,
  data: Omit<TeacherAvailability, "availability_id">,
) =>
  request<TeacherAvailability>(`/api/teacher-availability/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteTeacherAvailability = (id: number) =>
  request<void>(`/api/teacher-availability/${id}`, { method: "DELETE" });

export const getSubjectSections = () =>
  request<SubjectSection[]>("/api/subject-sections");
export const getSubjectSection = (id: number) =>
  request<SubjectSection>(`/api/subject-sections/${id}`);
export const createSubjectSection = (
  data: Omit<SubjectSection, "subject_section_id">,
) =>
  request<SubjectSection>("/api/subject-sections", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateSubjectSection = (
  id: number,
  data: Omit<SubjectSection, "subject_section_id">,
) =>
  request<SubjectSection>(`/api/subject-sections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteSubjectSection = (id: number) =>
  request<void>(`/api/subject-sections/${id}`, { method: "DELETE" });

export const getTimetable = (generationId?: number) =>
  request<TimetableEntry[]>(
    generationId ? `/api/timetable?generation_id=${generationId}` : "/api/timetable",
  );
export const deleteTimetableEntry = (id: number) =>
  request<void>(`/api/timetable/${id}`, { method: "DELETE" });
export const updateTimetableEntry = (
  id: number,
  data: Omit<TimetableEntry, "timetable_id">,
) =>
  request<void>(`/api/timetable/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const getTimetableGenerations = () =>
  request<TimetableGeneration[]>("/api/timetable/generations");
export const getTimetableChanges = (generationId?: number) =>
  request<TimetableChange[]>(generationId ? `/api/timetable/changes?generation_id=${generationId}` : "/api/timetable/changes");
export const generateTimetable = (data: {
  section_id: number;
  semester: number;
  academic_year: string;
  randomize?: boolean;
}) =>
  request<GenerateTimetableResult>("/api/timetable/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSubjects = () => request<Subject[]>("/api/subjects");
export const getSubject = (id: number) =>
  request<Subject>(`/api/subjects/${id}`);
export const createSubject = (data: Omit<Subject, "subject_id">) =>
  request<Subject>("/api/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateSubject = (id: number, data: Omit<Subject, "subject_id">) =>
  request<Subject>(`/api/subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteSubject = (id: number) =>
  request<void>(`/api/subjects/${id}`, { method: "DELETE" });

export const getClassrooms = () => request<Classroom[]>("/api/classrooms");
export const getClassroom = (id: number) =>
  request<Classroom>(`/api/classrooms/${id}`);
export const createClassroom = (data: Omit<Classroom, "classroom_id">) =>
  request<Classroom>("/api/classrooms", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateClassroom = (
  id: number,
  data: Omit<Classroom, "classroom_id">,
) =>
  request<Classroom>(`/api/classrooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteClassroom = (id: number) =>
  request<void>(`/api/classrooms/${id}`, { method: "DELETE" });

export const getTimeSlots = () => request<TimeSlot[]>("/api/time-slots");
export const getTimeSlot = (id: number) =>
  request<TimeSlot>(`/api/time-slots/${id}`);
export const createTimeSlot = (data: Omit<TimeSlot, "time_slot_id">) =>
  request<TimeSlot>("/api/time-slots", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateTimeSlot = (
  id: number,
  data: Omit<TimeSlot, "time_slot_id">,
) =>
  request<TimeSlot>(`/api/time-slots/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteTimeSlot = (id: number) =>
  request<void>(`/api/time-slots/${id}`, { method: "DELETE" });
