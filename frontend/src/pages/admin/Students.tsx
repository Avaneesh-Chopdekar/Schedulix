import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box, Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { deleteStudent, getSections, getStudents, type Section, type Student } from "../../services/crudApi";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [studentsData, sectionsData] = await Promise.all([getStudents(), getSections()]);
      setStudents(studentsData);
      setSections(sectionsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load students.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this student profile?")) return;
    try { await deleteStudent(id); await load(); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete student.");
    }
  }

  const sectionName = (id: number) => {
    const section = sections.find((s) => s.section_id === id);
    return section ? section.section_name : `Section #${id}`;
  };

  const filtered = students.filter((student) =>
    `${student.roll_number} ${student.user_id} ${student.section_id} ${sectionName(student.section_id)} ${student.admission_year}`
      .toLowerCase().includes(search.toLowerCase()),
  );

  return <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Students</Typography>
        <Typography color="text.secondary">Manage student profiles and enrolments.</Typography>
      </Box>
      <Button component={Link} to="/admin/students/add" variant="contained" startIcon={<Add />}>Add Student</Button>
    </Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search students by name/roll/section..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table>
      <TableHead><TableRow>{["Roll Number", "User ID", "Section", "Admission Year", "Actions"].map((heading) => <TableCell key={heading}><strong>{heading}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{filtered.map((student) => <TableRow key={student.student_id}>
        <TableCell><strong>{student.roll_number}</strong></TableCell><TableCell>{student.user_id}</TableCell>
        <TableCell>{sectionName(student.section_id)}</TableCell><TableCell>{student.admission_year}</TableCell>
        <TableCell><IconButton component={Link} to={`/admin/students/edit/${student.student_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(student.student_id)}><Delete /></IconButton></TableCell>
      </TableRow>)}</TableBody>
    </Table></TableContainer>
  </Box>;
}
