import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import {
  createSubjectSection, getSubjectSection,
  getSections, getSubjects, updateSubjectSection, type Section, type Subject,
} from "../../services/crudApi";

export default function AddSubjectSection() {
  const navigate = useNavigate(); const { id } = useParams(); const editing = Boolean(id);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState({ subject_id: 0, section_id: 0 });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([getSubjects(), getSections()]).then(([loadedSubjects, loadedSections]) => {
      setSubjects(loadedSubjects); setSections(loadedSections);
    }).catch((e) => setError(e instanceof Error ? e.message : "Unable to load assignment options."));
    if (id) void getSubjectSection(Number(id)).then(({ subject_section_id: _, ...data }) => setForm(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load assignment."));
  }, [id]);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (id) await updateSubjectSection(Number(id), form);
      else await createSubjectSection(form);
      navigate("/admin/subject-sections");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save assignment.");
    } finally { setSaving(false); }
  }

  return <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Assignment" : "Assign Subject"}</Typography>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 700 }}>
      <Box sx={{ display: "grid", gap: 3 }}>
        <TextField select required label="Subject" value={form.subject_id || ""} onChange={(e) => setForm({ ...form, subject_id: Number(e.target.value) })}>{subjects.map((subject) => <MenuItem key={subject.subject_id} value={subject.subject_id}>{subject.subject_code} - {subject.subject_name}</MenuItem>)}</TextField>
        <TextField select required label="Section" value={form.section_id || ""} onChange={(e) => setForm({ ...form, section_id: Number(e.target.value) })}>{sections.map((section) => <MenuItem key={section.section_id} value={section.section_id}>{section.section_name} - Semester {section.semester} ({section.academic_year})</MenuItem>)}</TextField>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}><Button variant="outlined" onClick={() => navigate("/admin/subject-sections")}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Assignment"}</Button></Box>
    </Paper>
  </Box>;
}
