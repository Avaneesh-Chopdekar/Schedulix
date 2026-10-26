import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccessTime, Add, Delete, Edit, Search } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { deleteTimeSlot, getTimeSlots, type TimeSlot } from "../../services/crudApi";

export default function TimeSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([]); const [search, setSearch] = useState(""); const [error, setError] = useState("");
  async function load() { try { setSlots(await getTimeSlots()); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load time slots."); } }
  useEffect(() => { void load(); }, []);
  async function handleDelete(id: number) { if (!window.confirm("Delete this time slot?")) return; try { await deleteTimeSlot(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete time slot."); } }
  const filtered = slots.filter((s) => `${s.day} ${s.slot_number} ${s.start_time} ${s.end_time}`.toLowerCase().includes(search.toLowerCase()));
  return <Box><Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}><Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Time Slots</Typography><Typography color="text.secondary">Manage scheduling periods.</Typography></Box><Button component={Link} to="/admin/timeslots/add" variant="contained" startIcon={<Add />}>Add Time Slot</Button></Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}<Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search time slots..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table><TableHead><TableRow>{["Slot", "Day", "Start", "End", "Actions"].map((h) => <TableCell key={h}><strong>{h}</strong></TableCell>)}</TableRow></TableHead><TableBody>{filtered.map((s) => <TableRow key={s.time_slot_id}><TableCell><Chip icon={<AccessTime />} label={`Slot ${s.slot_number}`} size="small" /></TableCell><TableCell>{s.day}</TableCell><TableCell>{s.start_time.slice(0, 5)}</TableCell><TableCell>{s.end_time.slice(0, 5)}</TableCell><TableCell><IconButton component={Link} to={`/admin/timeslots/edit/${s.time_slot_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(s.time_slot_id)}><Delete /></IconButton></TableCell></TableRow>)}</TableBody></Table></TableContainer>
  </Box>;
}
