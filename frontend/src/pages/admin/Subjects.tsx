import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box, Button, Chip, IconButton, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { deleteSubject, getSubjects, type Subject } from "../../services/crudApi";

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try { setSubjects(await getSubjects()); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load subjects.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try { await deleteSubject(id); await load(); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete subject.");
    }
  }

  const filtered = subjects.filter((s) =>
    `${s.subject_code} ${s.subject_name} ${s.subject_type}`.toLowerCase()
      .includes(search.toLowerCase()),
  );

  return <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Subjects</Typography>
        <Typography color="text.secondary">Manage subjects offered by the institution.</Typography>
      </Box>
      <Button component={Link} to="/admin/subjects/add" variant="contained" startIcon={<Add />}>Add Subject</Button>
    </Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table>
      <TableHead><TableRow>{["Code", "Subject Name", "Semester", "Credits", "Type", "Lectures / Week", "Actions"].map((h) => <TableCell key={h}><strong>{h}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{filtered.map((s) => <TableRow key={s.subject_id} hover>
        <TableCell><strong>{s.subject_code}</strong></TableCell><TableCell>{s.subject_name}</TableCell>
        <TableCell>{s.semester}</TableCell><TableCell>{s.credits}</TableCell>
        <TableCell><Chip label={s.subject_type} size="small" /></TableCell><TableCell>{s.lectures_per_week}</TableCell>
        <TableCell><IconButton component={Link} to={`/admin/subjects/edit/${s.subject_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(s.subject_id)}><Delete /></IconButton></TableCell>
      </TableRow>)}</TableBody>
    </Table></TableContainer>
  </Box>;
}
