import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Search } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { deleteTeacher, getTeachers, type Teacher } from "../../services/crudApi";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]); const [search, setSearch] = useState(""); const [error, setError] = useState("");
  async function load() { try { setTeachers(await getTeachers()); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load teachers."); } }
  useEffect(() => { void load(); }, []);
  async function handleDelete(id: number) { if (!window.confirm("Delete this teacher?")) return; try { await deleteTeacher(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete teacher."); } }
  const filtered = teachers.filter((t) => `${t.employee_id} ${t.user_id} ${t.designation} ${t.employment_type}`.toLowerCase().includes(search.toLowerCase()));
  return <Box><Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}><Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Teachers</Typography><Typography color="text.secondary">Manage faculty profiles.</Typography></Box><Button component={Link} to="/admin/teachers/add" variant="contained" startIcon={<Add />}>Add Teacher</Button></Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}<Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table><TableHead><TableRow>{["Employee ID", "User ID", "Department", "Designation", "Employment", "Actions"].map((h) => <TableCell key={h}><strong>{h}</strong></TableCell>)}</TableRow></TableHead><TableBody>{filtered.map((t) => <TableRow key={t.teacher_id}><TableCell><strong>{t.employee_id}</strong></TableCell><TableCell>{t.user_id}</TableCell><TableCell>{t.department_id}</TableCell><TableCell>{t.designation}</TableCell><TableCell>{t.employment_type}</TableCell><TableCell><IconButton color="error" onClick={() => void handleDelete(t.teacher_id)}><Delete /></IconButton></TableCell></TableRow>)}</TableBody></Table></TableContainer>
  </Box>;
}
