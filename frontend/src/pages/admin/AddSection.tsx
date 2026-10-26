import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import {
  createSection, getDepartments, getSection, updateSection,
  type Department, type Section,
} from "../../services/crudApi";

type SectionForm = Omit<Section, "section_id">;

export default function AddSection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState<SectionForm>({
    section_name: "", semester: 1, academic_year: "", department_id: 0,
    student_capacity: 1,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getDepartments().then(setDepartments).catch((e) =>
      setError(e instanceof Error ? e.message : "Unable to load departments."),
    );
    if (id) void getSection(Number(id)).then(({ section_id: _, ...data }) =>
      setForm(data),
    ).catch((e) => setError(e instanceof Error ? e.message : "Unable to load section."));
  }, [id]);

  function set<K extends keyof SectionForm>(key: K, value: SectionForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (id) await updateSection(Number(id), form);
      else await createSection(form);
      navigate("/admin/sections");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save section.");
    } finally { setSaving(false); }
  }

  return <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Section" : "Add Section"}</Typography>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 900 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
        <TextField required label="Section Name" value={form.section_name} onChange={(e) => set("section_name", e.target.value)} />
        <TextField select required label="Semester" value={form.semester} onChange={(e) => set("semester", Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
        <TextField required label="Academic Year" placeholder="2026-27" value={form.academic_year} onChange={(e) => set("academic_year", e.target.value)} />
        <TextField select required label="Department" value={form.department_id || ""} onChange={(e) => set("department_id", Number(e.target.value))}>{departments.map((department) => <MenuItem key={department.department_id} value={department.department_id}>{department.department_name}</MenuItem>)}</TextField>
        <TextField required type="number" label="Student Capacity" value={form.student_capacity} onChange={(e) => set("student_capacity", Number(e.target.value))} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/admin/sections")}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Section"}</Button>
      </Box>
    </Paper>
  </Box>;
}
