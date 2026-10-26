import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box, Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { deleteSection, getSections, type Section } from "../../services/crudApi";

export default function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try { setSections(await getSections()); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load sections.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this section?")) return;
    try { await deleteSection(id); await load(); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete section.");
    }
  }

  const filtered = sections.filter((section) =>
    `${section.section_name} ${section.academic_year} ${section.department_id}`
      .toLowerCase().includes(search.toLowerCase()),
  );

  return <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Sections</Typography>
        <Typography color="text.secondary">Manage student sections and capacities.</Typography>
      </Box>
      <Button component={Link} to="/admin/sections/add" variant="contained" startIcon={<Add />}>Add Section</Button>
    </Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search sections..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table>
      <TableHead><TableRow>{["Section", "Semester", "Academic Year", "Department", "Capacity", "Actions"].map((heading) => <TableCell key={heading}><strong>{heading}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{filtered.map((section) => <TableRow key={section.section_id}>
        <TableCell><strong>{section.section_name}</strong></TableCell><TableCell>{section.semester}</TableCell>
        <TableCell>{section.academic_year}</TableCell><TableCell>{section.department_id}</TableCell>
        <TableCell>{section.student_capacity}</TableCell><TableCell>
          <IconButton component={Link} to={`/admin/sections/edit/${section.section_id}`} color="primary"><Edit /></IconButton>
          <IconButton color="error" onClick={() => void handleDelete(section.section_id)}><Delete /></IconButton>
        </TableCell>
      </TableRow>)}</TableBody>
    </Table></TableContainer>
  </Box>;
}
