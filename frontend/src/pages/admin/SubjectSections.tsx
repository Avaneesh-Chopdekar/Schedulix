import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box, Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import {
  deleteSubjectSection, getSubjectSections, type SubjectSection,
} from "../../services/crudApi";

export default function SubjectSections() {
  const [mappings, setMappings] = useState<SubjectSection[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try { setMappings(await getSubjectSections()); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load assignments.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Remove this subject from the section?")) return;
    try { await deleteSubjectSection(id); await load(); } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to remove assignment.");
    }
  }

  const filtered = mappings.filter((mapping) =>
    `${mapping.subject_id} ${mapping.section_id}`.includes(search.trim()),
  );

  return <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Subject Assignments</Typography>
        <Typography color="text.secondary">Assign curriculum subjects to sections.</Typography>
      </Box>
      <Button component={Link} to="/admin/subject-sections/add" variant="contained" startIcon={<Add />}>Assign Subject</Button>
    </Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper sx={{ p: 2, mb: 2 }}><TextField fullWidth size="small" placeholder="Search by subject or section ID..." value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} /></Paper>
    <TableContainer component={Paper}><Table>
      <TableHead><TableRow>{["Mapping ID", "Subject ID", "Section ID", "Actions"].map((heading) => <TableCell key={heading}><strong>{heading}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{filtered.map((mapping) => <TableRow key={mapping.subject_section_id}>
        <TableCell>{mapping.subject_section_id}</TableCell><TableCell>{mapping.subject_id}</TableCell><TableCell>{mapping.section_id}</TableCell>
        <TableCell><IconButton component={Link} to={`/admin/subject-sections/edit/${mapping.subject_section_id}`} color="primary"><Edit /></IconButton><IconButton color="error" onClick={() => void handleDelete(mapping.subject_section_id)}><Delete /></IconButton></TableCell>
      </TableRow>)}</TableBody>
    </Table></TableContainer>
  </Box>;
}
