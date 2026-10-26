import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import {
  getClassrooms, getSections, getSubjects, getTeachers, getTimeSlots, getTimetable, getTimetableGenerations,
  type Classroom, type Section, type Subject, type Teacher, type TimeSlot, type TimetableEntry,
} from "../../services/crudApi";

export default function TeachingAssignments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTeacherId = searchParams.get("teacher_id") ?? "";
  const [data, setData] = useState<{ teachers: Teacher[]; subjects: Subject[]; classrooms: Classroom[]; sections: Section[]; slots: TimeSlot[]; entries: TimetableEntry[] }>({ teachers: [], subjects: [], classrooms: [], sections: [], slots: [], entries: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getTeachers(), getSubjects(), getClassrooms(), getSections(), getTimeSlots(), getTimetable(), getTimetableGenerations()])
      .then(([teachers, subjects, classrooms, sections, slots, entries, generations]) => {
        const latest = new Map<number, number>();
        generations.forEach((generation) => {
          if (generation.status === "SUCCESS" && (!latest.has(generation.section_id) || generation.generation_id > (latest.get(generation.section_id) ?? 0))) latest.set(generation.section_id, generation.generation_id);
        });
        setData({ teachers, subjects, classrooms, sections, slots, entries: entries.filter((entry) => latest.get(entry.section_id) === entry.generation_id) });
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load teaching assignments."));
  }, []);

  const teacherName = (id: number) => { const item = data.teachers.find((teacher) => teacher.teacher_id === id); return item ? `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || item.employee_id : "Unassigned"; };
  const subjectName = (id: number) => data.subjects.find((item) => item.subject_id === id)?.subject_name ?? "Unknown";
  const sectionName = (id: number) => data.sections.find((item) => item.section_id === id)?.section_name ?? "Unknown";
  const roomName = (id: number) => data.classrooms.find((item) => item.classroom_id === id)?.room_number ?? "Unknown";
  const rows = useMemo(() => data.entries.slice().sort((a, b) => a.teacher_id - b.teacher_id || a.time_slot_id - b.time_slot_id), [data.entries]);
  const filteredRows = useMemo(() => selectedTeacherId ? rows.filter((entry) => String(entry.teacher_id) === selectedTeacherId) : rows, [rows, selectedTeacherId]);
  const selectedTeacher = data.teachers.find((teacher) => String(teacher.teacher_id) === selectedTeacherId);

  return <Box>
    <Button component={Link} to="/admin/dashboard" startIcon={<ArrowBack />} sx={{ mb: 2 }}>Back to dashboard</Button>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>{selectedTeacher ? `${selectedTeacher.first_name ?? ""} ${selectedTeacher.last_name ?? ""}`.trim() || selectedTeacher.employee_id : "Teaching assignments"}</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>{selectedTeacher ? "Complete weekly class record for this teacher." : "A record of which teacher occupies each class, section, room, and time slot."}</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Paper sx={{ p: 2, mb: 2 }}>
      <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 300 } }}>
        <InputLabel>Teacher</InputLabel>
        <Select value={selectedTeacherId} label="Teacher" onChange={(event) => setSearchParams(event.target.value ? { teacher_id: event.target.value } : {})}>
          <MenuItem value="">All teachers</MenuItem>
          {data.teachers.slice().sort((a, b) => teacherName(a.teacher_id).localeCompare(teacherName(b.teacher_id))).map((teacher) => <MenuItem key={teacher.teacher_id} value={String(teacher.teacher_id)}>{teacherName(teacher.teacher_id)}</MenuItem>)}
        </Select>
      </FormControl>
    </Paper>
    <TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>Teacher</TableCell><TableCell>Subject</TableCell><TableCell>Section</TableCell><TableCell>Room</TableCell><TableCell>Day</TableCell><TableCell>Time</TableCell></TableRow></TableHead><TableBody>{filteredRows.length ? filteredRows.map((entry) => { const slot = data.slots.find((item) => item.time_slot_id === entry.time_slot_id); return <TableRow key={entry.timetable_id}><TableCell sx={{ fontWeight: 600 }}>{teacherName(entry.teacher_id)}</TableCell><TableCell>{subjectName(entry.subject_id)}</TableCell><TableCell>{sectionName(entry.section_id)}</TableCell><TableCell>{roomName(entry.classroom_id)}</TableCell><TableCell>{slot?.day ?? "—"}</TableCell><TableCell>{slot ? `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}` : "—"}</TableCell></TableRow>; }) : <TableRow><TableCell colSpan={6}><Typography color="text.secondary">No current teaching assignments found.</Typography></TableCell></TableRow>}</TableBody></Table></TableContainer>
  </Box>;
}

function formatTime(value: string) { const [hours, minutes] = value.split(":").map(Number); return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
