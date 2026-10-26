import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { createSubject, getSubject, updateSubject, type Subject } from "../../services/crudApi";

export default function AddSubject() {
  const navigate = useNavigate(); const { id } = useParams(); const editing = Boolean(id);
  const [form, setForm] = useState<Omit<Subject, "subject_id">>({ subject_code: "", subject_name: "", semester: 1, credits: 1, subject_type: "THEORY", lectures_per_week: 1, required_room_type: "CLASSROOM" });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { if (id) void getSubject(Number(id)).then(({ subject_id: _, ...data }) => setForm(data)).catch((e) => setError(e instanceof Error ? e.message : "Unable to load subject.")); }, [id]);
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(""); try { if (id) await updateSubject(Number(id), form); else await createSubject(form); navigate("/admin/subjects"); } catch (e) { setError(e instanceof Error ? e.message : "Unable to save subject."); } finally { setSaving(false); } }
  return <Box><Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Subject" : "Add Subject"}</Typography>{error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}<Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 900 }}><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
    <TextField required label="Subject Code" value={form.subject_code} onChange={(e) => set("subject_code", e.target.value)} /><TextField required label="Subject Name" value={form.subject_name} onChange={(e) => set("subject_name", e.target.value)} />
    <TextField select required label="Semester" value={form.semester} onChange={(e) => set("semester", Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>
    <TextField required type="number" label="Credits" value={form.credits} onChange={(e) => set("credits", Number(e.target.value))} /><TextField required type="number" label="Lectures per Week" value={form.lectures_per_week} onChange={(e) => set("lectures_per_week", Number(e.target.value))} />
    <TextField select required label="Subject Type" value={form.subject_type} onChange={(e) => set("subject_type", e.target.value as Subject["subject_type"])}><MenuItem value="THEORY">Theory</MenuItem><MenuItem value="PRACTICAL">Practical</MenuItem></TextField>
    <TextField select required label="Required Room Type" value={form.required_room_type} onChange={(e) => set("required_room_type", e.target.value as Subject["required_room_type"])}><MenuItem value="CLASSROOM">Classroom</MenuItem><MenuItem value="LAB">Lab</MenuItem><MenuItem value="SEMINAR">Seminar</MenuItem></TextField>
  </Box><Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}><Button variant="outlined" onClick={() => navigate("/admin/subjects")}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Subject"}</Button></Box></Paper></Box>;
}
