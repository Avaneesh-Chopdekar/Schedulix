import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { CalendarMonth, Logout, NotificationsActive } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getClassrooms, getSubjects, getTeachers, getTimeSlots, getTimetable, getTeacherAbsences, getTimetableChanges, getTimetableGenerations, type Classroom, type Subject, type Teacher, type TimeSlot, type TimetableChange, type TimetableEntry, type TeacherAbsence } from "../../services/crudApi";
import ThemeToggle from "../../components/ThemeToggle";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const holidays = [
  { name: "Independence Day", date: "August 15, 2026" },
  { name: "Janmashtami", date: "September 4, 2026" },
  { name: "Ganesh Chaturthi", date: "September 14, 2026" },
  { name: "Mahatma Gandhi Jayanti", date: "October 2, 2026" },
  { name: "Dussehra", date: "October 20, 2026" },
  { name: "Diwali / Deepavali", date: "November 8, 2026" },
  { name: "Guru Nanak Jayanti", date: "November 24, 2026" },
  { name: "Christmas Day", date: "December 25, 2026" },
  { name: "Makar Sankranti / Pongal", date: "January 14, 2027" },
  { name: "Republic Day", date: "January 26, 2027" },
  { name: "Maha Shivratri", date: "March 6, 2027" },
  { name: "Holi", date: "March 22, 2027" },
  { name: "Eid al-Fitr", date: "March 10, 2027 (tentative)" },
];

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [rooms, setRooms] = useState<Classroom[]>([]);
  const [changes, setChanges] = useState<TimetableChange[]>([]);
  const [error, setError] = useState("");
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [allEntries, allSlots, allSubjects, allTeachers, allRooms, generations, allChanges, allAbsences] = await Promise.all([
          getTimetable(), getTimeSlots(), getSubjects(), getTeachers(), getClassrooms(), getTimetableGenerations(), getTimetableChanges(), getTeacherAbsences(),
        ]);
        const sectionEntries = allEntries.filter((entry) => entry.section_id === user?.section_id);
        const latest = generations.filter((generation) => generation.section_id === user?.section_id).sort((a, b) => b.generation_id - a.generation_id)[0];
        setEntries(latest ? sectionEntries.filter((entry) => entry.generation_id === latest.generation_id) : sectionEntries);
        setSlots(allSlots); setSubjects(allSubjects); setTeachers(allTeachers); setRooms(allRooms);
        setChanges(allChanges.filter((change) => !latest || change.generation_id === latest.generation_id).slice(0, 5)); setAbsences(allAbsences);
      } catch (e) { setError(e instanceof Error ? e.message : "Unable to load your dashboard."); }
    }
    if (user?.section_id) void load();
  }, [user?.section_id]);

  const subjectName = (id: number) => subjects.find((item) => item.subject_id === id)?.subject_name ?? "Scheduled class";
  const teacherName = (id: number) => { const item = teachers.find((teacher) => teacher.teacher_id === id); return item ? [item.first_name, item.last_name].filter(Boolean).join(" ") || item.employee_id : "Faculty"; };
  const roomName = (id: number) => rooms.find((room) => room.classroom_id === id)?.room_number ?? "Room";
  const today = days[new Date().getDay() - 1] ?? "MONDAY";
  const todayEntries = useMemo(() => entries.filter((entry) => slots.find((slot) => slot.time_slot_id === entry.time_slot_id)?.day === today).sort((a, b) => (slots.find((slot) => slot.time_slot_id === a.time_slot_id)?.start_time ?? "").localeCompare(slots.find((slot) => slot.time_slot_id === b.time_slot_id)?.start_time ?? "")), [entries, slots, today]);
  const timeRows = useMemo(() => [...new Set(slots.map((slot) => `${slot.start_time.slice(0, 5)}|${slot.end_time.slice(0, 5)}`))].sort(), [slots]);
  const slotFor = (day: string, timeRow: string) => slots.find((slot) => slot.day === day && `${slot.start_time.slice(0, 5)}|${slot.end_time.slice(0, 5)}` === timeRow);
  const entryFor = (day: string, timeRow: string) => {
    const slot = slotFor(day, timeRow);
    return entries.find((entry) => entry.time_slot_id === slot?.time_slot_id);
  };

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/auth/login", { replace: true });
    }
  }

  return <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Welcome, {user?.first_name}</Typography><Typography color="text.secondary">{user?.section_name ?? "Your section"} · Semester {user?.semester ?? "-" } · Roll no. {user?.roll_number ?? "-"}</Typography></Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <ThemeToggle />
            <Button variant="outlined" startIcon={<Logout />} onClick={() => void handleLogout()}>Logout</Button>
          </Stack>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 8 }}><Card><CardContent><Typography variant="h6" sx={{ fontWeight: 700 }}>Today · {today}</Typography><Divider sx={{ my: 1 }} />{todayEntries.length ? todayEntries.map((entry) => { const slot = slots.find((item) => item.time_slot_id === entry.time_slot_id); return <Box key={entry.timetable_id} sx={{ py: 1 }}><Typography sx={{ fontWeight: 700 }}>{slot ? `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}` : ""} · {subjectName(entry.subject_id)}</Typography><Typography variant="body2" color="text.secondary">{teacherName(entry.teacher_id)} · {roomName(entry.classroom_id)}</Typography></Box>; }) : <Typography color="text.secondary">No classes scheduled today.</Typography>}</CardContent></Card></Grid>
          <Grid size={{ xs: 12, md: 4 }}><Card sx={{ height: "100%" }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700 }}>Academic updates</Typography><Stack spacing={1.5} sx={{ mt: 2 }}><Chip icon={<CalendarMonth />} label={`${entries.length} classes in your timetable`} /><Chip icon={<NotificationsActive />} label={`${changes.length + absences.length} notices`} color={changes.length + absences.length ? "warning" : "default"} /></Stack><Divider sx={{ my: 1.5 }} /><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Rescheduling</Typography>{changes.length ? changes.slice(0, 3).map((change) => <Typography key={change.change_id} variant="caption" sx={{ display: "block", mt: 0.5 }}>Entry #{change.timetable_id} updated at {new Date(change.changed_at).toLocaleDateString()}.</Typography>) : <Typography variant="caption" color="text.secondary">No recent rescheduling notices.</Typography>}<Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1.5 }}>Faculty absence</Typography>{absences.length ? absences.slice(0, 3).map((absence) => <Typography key={absence.absence_id} variant="caption" sx={{ display: "block", mt: 0.5 }}>{absence.first_name} {absence.last_name} · {absence.absence_date}</Typography>) : <Typography variant="caption" color="text.secondary">No faculty absence notices.</Typography>}</CardContent></Card></Grid>
        </Grid>
        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, px: 1, mb: 1 }}>Weekly timetable</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 850, display: "grid", gridTemplateColumns: "105px repeat(6, minmax(120px, 1fr))" }}>
              <Box sx={{ p: 1.5, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700 }}>Time</Box>
              {days.map((day) => <Box key={day} sx={{ p: 1.5, bgcolor: "primary.main", color: "primary.contrastText", textAlign: "center", fontWeight: 700, fontSize: "0.78rem" }}>{day}</Box>)}
              {timeRows.map((timeRow) => {
                const [start, end] = timeRow.split("|");
                return <Box key={timeRow} sx={{ display: "contents" }}>
                  <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider", fontSize: "0.78rem", fontWeight: 600 }}>{formatTime(start)} - {formatTime(end)}</Box>
                  {days.map((day) => {
                    const slot = slotFor(day, timeRow);
                    const entry = entryFor(day, timeRow);
                    return <Box key={`${day}-${timeRow}`} sx={{ p: 1, minHeight: 82, borderLeft: 1, borderBottom: 1, borderColor: "divider", bgcolor: slot?.is_break ? "warning.50" : day === today ? "action.hover" : "background.paper" }}>
                      {!slot ? <Typography variant="caption" color="text.disabled">—</Typography> : slot.is_break ? <Typography variant="caption" sx={{ fontWeight: 700 }}>Lunch</Typography> : entry ? <><Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>{subjectName(entry.subject_id)}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{teacherName(entry.teacher_id)}</Typography><Typography variant="caption" color="text.secondary">{roomName(entry.classroom_id)}</Typography></> : <Typography variant="caption" color="text.disabled">Free</Typography>}
                    </Box>;
                  })}
                </Box>;
              })}
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, px: 1 }}>Swipe horizontally on smaller screens to view all days.</Typography>
        </Paper>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}><Paper sx={{ p: 2, maxHeight: 360, overflowY: "auto" }}><Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>College holidays · 2026–27</Typography>{holidays.map((holiday) => <Box key={holiday.name} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1, borderBottom: 1, borderColor: "divider" }}><Typography variant="body2">{holiday.name}</Typography><Typography variant="body2" color="text.secondary" sx={{ textAlign: "right" }}>{holiday.date}</Typography></Box>)}</Paper></Grid>
        </Grid>
      </Box>;
}

function formatTime(value: string) { const [hours, minutes] = value.split(":").map(Number); return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
