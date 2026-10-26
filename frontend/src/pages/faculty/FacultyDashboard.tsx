import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { EventBusy, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getClassrooms, getSections, getSubjects, getTeachers, getTimeSlots, getTimetable, getTeacherAbsences, markTeacherAbsent, type Classroom, type Section, type Subject, type Teacher, type TimeSlot, type TimetableEntry, type TeacherAbsence } from "../../services/crudApi";
import ThemeToggle from "../../components/ThemeToggle";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function FacultyDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [rooms, setRooms] = useState<Classroom[]>([]);
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [absenceDate, setAbsenceDate] = useState("today");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [loadedEntries, loadedSlots, loadedSubjects, loadedTeachers, loadedSections, loadedRooms, loadedAbsences] = await Promise.all([
          getTimetable(), getTimeSlots(), getSubjects(), getTeachers(), getSections(), getClassrooms(), getTeacherAbsences(),
        ]);
        const teacher = loadedTeachers.find((item) => item.user_id === user?.user_id);
        const latestBySection = new Map<number, number>();
        loadedEntries.forEach((entry) => { if (!latestBySection.has(entry.section_id) || entry.generation_id > (latestBySection.get(entry.section_id) ?? 0)) latestBySection.set(entry.section_id, entry.generation_id); });
        setEntries(teacher ? loadedEntries.filter((entry) => entry.teacher_id === teacher.teacher_id && latestBySection.get(entry.section_id) === entry.generation_id) : []);
        setSlots(loadedSlots); setSubjects(loadedSubjects); setTeachers(loadedTeachers); setSections(loadedSections); setRooms(loadedRooms); setAbsences(loadedAbsences);
      } catch (e) { setError(e instanceof Error ? e.message : "Unable to load faculty dashboard."); }
    }
    void load();
  }, [user?.user_id]);

  const teacher = teachers.find((item) => item.user_id === user?.user_id);
  const subjectName = (id: number) => subjects.find((item) => item.subject_id === id)?.subject_name ?? "Scheduled lecture";
  const sectionName = (id: number) => sections.find((item) => item.section_id === id)?.section_name ?? "Section";
  const roomName = (id: number) => rooms.find((item) => item.classroom_id === id)?.room_number ?? "Room";
  const today = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][new Date().getDay()];
  const todayEntries = useMemo(() => entries.filter((entry) => slots.find((slot) => slot.time_slot_id === entry.time_slot_id)?.day === today).sort((a, b) => slotForEntry(a)?.start_time.localeCompare(slotForEntry(b)?.start_time ?? "") ?? 0), [entries, slots, today]);
  const timeRows = useMemo(() => [...new Set(slots.map((slot) => `${slot.start_time.slice(0, 5)}|${slot.end_time.slice(0, 5)}`))].sort(), [slots]);
  const todayDate = dateString(0);
  const tomorrowDate = dateString(1);
  const dateValue = absenceDate === "today" ? todayDate : tomorrowDate;
  function slotForEntry(entry: TimetableEntry) { return slots.find((slot) => slot.time_slot_id === entry.time_slot_id); }
  function entryFor(day: string, timeRow: string) {
    const slot = slots.find((item) => item.day === day && `${item.start_time.slice(0, 5)}|${item.end_time.slice(0, 5)}` === timeRow);
    return entries.find((entry) => entry.time_slot_id === slot?.time_slot_id);
  }

  async function markAbsent() {
    try { await markTeacherAbsent(dateValue, "Faculty unavailable"); setMessage(`Marked absent for ${absenceDate}. Students will see this notice.`); setError(""); setAbsences(await getTeacherAbsences()); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to mark absence."); }
  }
  async function handleLogout() { try { await logout(); } finally { navigate("/auth/login", { replace: true }); } }

  return <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Faculty Dashboard</Typography><Typography color="text.secondary">Welcome, {user?.first_name} {user?.last_name}</Typography></Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <ThemeToggle />
        <Button variant="outlined" startIcon={<Logout />} onClick={() => void handleLogout()}>Logout</Button>
      </Stack>
    </Box>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}{message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 8 }}><Card sx={{ bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 3, boxShadow: 3 }}><CardContent sx={{ p: { xs: 2, md: 3 } }}><Typography variant="overline" sx={{ opacity: 0.8 }}>Teaching schedule</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>Today · {today}</Typography><Stack spacing={1.5} sx={{ mt: 2 }}>{todayEntries.length ? todayEntries.map((entry) => { const slot = slotForEntry(entry); return <Box key={entry.timetable_id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,.1)" }}><Typography variant="caption" sx={{ opacity: 0.8 }}>{slot ? `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}` : "Scheduled lecture"}</Typography><Typography sx={{ fontWeight: 700, mt: 0.5 }}>{subjectName(entry.subject_id)}</Typography><Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}><Chip size="small" label={`Batch: ${sectionName(entry.section_id)}`} sx={{ bgcolor: "rgba(255,255,255,.16)", color: "inherit" }} /><Chip size="small" label={`Room: ${roomName(entry.classroom_id)}`} sx={{ bgcolor: "rgba(255,255,255,.16)", color: "inherit" }} /></Box></Box>; }) : <Typography sx={{ opacity: 0.8 }}>No lectures assigned today.</Typography>}</Stack></CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Paper sx={{ p: { xs: 2, md: 3 }, height: "100%", borderTop: 4, borderColor: "warning.main" }}><Typography variant="h6" sx={{ fontWeight: 700 }}>Mark yourself absent</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Students in your sections will be notified.</Typography><Select fullWidth size="small" value={absenceDate} onChange={(event) => setAbsenceDate(event.target.value)} sx={{ mt: 2 }}><MenuItem value="today">Today · {todayDate}</MenuItem><MenuItem value="tomorrow">Tomorrow · {tomorrowDate}</MenuItem></Select><Button fullWidth variant="contained" color="warning" startIcon={<EventBusy />} onClick={() => void markAbsent()} sx={{ mt: 2 }}>Mark absent</Button></Paper></Grid>
    </Grid>
    <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, px: 1, mb: 1 }}>Weekly teaching schedule</Typography>
      <Box sx={{ overflowX: "auto" }}><Box sx={{ minWidth: 850, display: "grid", gridTemplateColumns: "105px repeat(6, minmax(120px, 1fr))" }}>
        <Box sx={{ p: 1.5, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700 }}>Time</Box>
        {days.map((day) => <Box key={day} sx={{ p: 1.5, bgcolor: "primary.main", color: "primary.contrastText", textAlign: "center", fontSize: "0.78rem", fontWeight: 700 }}>{day}</Box>)}
        {timeRows.map((timeRow) => { const [start, end] = timeRow.split("|"); return <Box key={timeRow} sx={{ display: "contents" }}>
          <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider", fontSize: "0.78rem", fontWeight: 600 }}>{formatTime(start)} - {formatTime(end)}</Box>
          {days.map((day) => { const slot = slots.find((item) => item.day === day && `${item.start_time.slice(0, 5)}|${item.end_time.slice(0, 5)}` === timeRow); const entry = entryFor(day, timeRow); return <Box key={`${day}-${timeRow}`} sx={{ p: 1.25, minHeight: 94, borderLeft: 1, borderBottom: 1, borderColor: "divider", bgcolor: slot?.is_break ? "warning.50" : day === today ? "action.hover" : "background.paper" }}>{slot?.is_break ? <Typography variant="caption" sx={{ fontWeight: 700 }}>Lunch</Typography> : entry ? <Stack spacing={0.4}><Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>{subjectName(entry.subject_id)}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Batch: {sectionName(entry.section_id)}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Room: {roomName(entry.classroom_id)}</Typography></Stack> : <Typography variant="caption" color="text.disabled">{slot ? "Free" : "—"}</Typography>}</Box>; })}
        </Box>; })}
      </Box></Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, px: 1 }}>Swipe horizontally on smaller screens to view all days.</Typography>
    </Paper>
    <Paper sx={{ p: 2 }}><Typography variant="h6" sx={{ fontWeight: 700 }}>Absence notices</Typography>{absences.filter((item) => item.teacher_id === teacher?.teacher_id).map((item) => <Chip key={item.absence_id} label={`${item.absence_date}: absent${item.reason ? ` · ${item.reason}` : ""}`} sx={{ mr: 1, mt: 1 }} />)}</Paper>
  </Box>;
}
function dateString(offset: number) { const date = new Date(); date.setDate(date.getDate() + offset); return date.toISOString().slice(0, 10); }
function formatTime(value: string) { const [hours, minutes] = value.split(":").map(Number); return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
