import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import {
  deleteTeacherAvailability, getTeachers, getTeacherAvailability, getTimeSlots,
  type Teacher, type TeacherAvailability as Availability, type TimeSlot,
} from "../../services/crudApi";

export default function TeacherAvailability() {
  const [records, setRecords] = useState<Availability[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [recordsData, teachersData, timeSlotsData] = await Promise.all([getTeacherAvailability(), getTeachers(), getTimeSlots()]);
      setRecords(recordsData);
      setTeachers(teachersData);
      setTimeSlots(timeSlotsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load availability.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this availability record?")) return;
    try { await deleteTeacherAvailability(id); await load(); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete availability.");
    }
  }

  const teacherName = (id: number) => {
    const t = teachers.find((teacher) => teacher.teacher_id === id);
    if (!t) return `Teacher #${id}`;
    const fullName = `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim();
    return fullName || t.employee_id || `Teacher #${id}`;
  };
  const timeSlotLabel = (id: number) => {
    const slot = timeSlots.find((s) => s.time_slot_id === id);
    return slot ? `${slot.day} (${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)})` : `Slot #${id}`;
  };

  const filtered = records.filter((record) =>
    `${record.teacher_id} ${teacherName(record.teacher_id)} ${record.time_slot_id} ${timeSlotLabel(record.time_slot_id)} ${record.day} ${record.is_available}`
      .toLowerCase().includes(search.toLowerCase()),
  );

  return <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Teacher Availability</Typography>
        <Typography color="text.secondary">Manage teaching availability by time slot.</Typography>
      </Box>
      <Button component={Link} to="/admin/teacher-availability/add" variant="contained" startIcon={<Add />}>Add Availability</Button>
    </Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search availability by teacher or time slot..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table>
      <TableHead><TableRow>{["Teacher", "Time Slot", "Day", "Availability", "Actions"].map((heading) => <TableCell key={heading}><strong>{heading}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{filtered.map((record) => <TableRow key={record.availability_id}>
        <TableCell><strong>{teacherName(record.teacher_id)}</strong></TableCell><TableCell>{timeSlotLabel(record.time_slot_id)}</TableCell><TableCell>{record.day}</TableCell>
        <TableCell><Chip label={record.is_available ? "Available" : "Unavailable"} color={record.is_available ? "success" : "default"} size="small" /></TableCell>
        <TableCell><IconButton component={Link} to={`/admin/teacher-availability/edit/${record.availability_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(record.availability_id)}><Delete /></IconButton></TableCell>
      </TableRow>)}</TableBody>
    </Table></TableContainer>
  </Box>;
}
