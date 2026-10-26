import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import {
  deleteTeacherAvailability, getTeacherAvailability,
  type TeacherAvailability as Availability,
} from "../../services/crudApi";

export default function TeacherAvailability() {
  const [records, setRecords] = useState<Availability[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try { setRecords(await getTeacherAvailability()); } catch (e) {
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

  const filtered = records.filter((record) =>
    `${record.teacher_id} ${record.time_slot_id} ${record.day} ${record.is_available}`
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
    <Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search availability..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table>
      <TableHead><TableRow>{["Teacher ID", "Time Slot ID", "Day", "Availability", "Actions"].map((heading) => <TableCell key={heading}><strong>{heading}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{filtered.map((record) => <TableRow key={record.availability_id}>
        <TableCell>{record.teacher_id}</TableCell><TableCell>{record.time_slot_id}</TableCell><TableCell>{record.day}</TableCell>
        <TableCell><Chip label={record.is_available ? "Available" : "Unavailable"} color={record.is_available ? "success" : "default"} size="small" /></TableCell>
        <TableCell><IconButton component={Link} to={`/admin/teacher-availability/edit/${record.availability_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(record.availability_id)}><Delete /></IconButton></TableCell>
      </TableRow>)}</TableBody>
    </Table></TableContainer>
  </Box>;
}
