import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { deleteClassroom, getClassrooms, type Classroom } from "../../services/crudApi";

export default function Classrooms() {
  const [rooms, setRooms] = useState<Classroom[]>([]); const [search, setSearch] = useState(""); const [error, setError] = useState("");
  async function load() { try { setRooms(await getClassrooms()); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load classrooms."); } }
  useEffect(() => { void load(); }, []);
  async function handleDelete(id: number) { if (!window.confirm("Delete this classroom?")) return; try { await deleteClassroom(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete classroom."); } }
  const filtered = rooms.filter((r) => `${r.room_number} ${r.building} ${r.room_type}`.toLowerCase().includes(search.toLowerCase()));
  return <Box><Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}><Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Classrooms</Typography><Typography color="text.secondary">Manage teaching spaces.</Typography></Box><Button component={Link} to="/admin/classrooms/add" variant="contained" startIcon={<Add />}>Add Classroom</Button></Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}<Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search classrooms..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table><TableHead><TableRow>{["Room", "Building", "Floor", "Capacity", "Type", "Status", "Actions"].map((h) => <TableCell key={h}><strong>{h}</strong></TableCell>)}</TableRow></TableHead><TableBody>{filtered.map((r) => <TableRow key={r.classroom_id}><TableCell><strong>{r.room_number}</strong></TableCell><TableCell>{r.building}</TableCell><TableCell>{r.floor}</TableCell><TableCell>{r.capacity}</TableCell><TableCell><Chip label={r.room_type} size="small" /></TableCell><TableCell><Chip label={r.status} size="small" color={r.status === "AVAILABLE" ? "success" : "warning"} /></TableCell><TableCell><IconButton component={Link} to={`/admin/classrooms/edit/${r.classroom_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(r.classroom_id)}><Delete /></IconButton></TableCell></TableRow>)}</TableBody></Table></TableContainer>
  </Box>;
}
