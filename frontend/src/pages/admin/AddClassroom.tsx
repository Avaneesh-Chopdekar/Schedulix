import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { createClassroom, getClassroom, updateClassroom, type Classroom } from "../../services/crudApi";

export default function AddClassroom() {
  const navigate = useNavigate(); const { id } = useParams(); const editing = Boolean(id);
  const [form, setForm] = useState<Omit<Classroom, "classroom_id">>({ room_number: "", building: "", floor: 0, capacity: 1, room_type: "CLASSROOM", status: "AVAILABLE" });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { if (id) void getClassroom(Number(id)).then(({ classroom_id: _, ...data }) => setForm(data)).catch((e) => setError(e instanceof Error ? e.message : "Unable to load classroom.")); }, [id]);
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(""); try { if (id) await updateClassroom(Number(id), form); else await createClassroom(form); navigate("/admin/classrooms"); } catch (e) { setError(e instanceof Error ? e.message : "Unable to save classroom."); } finally { setSaving(false); } }
  return <Box><Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Classroom" : "Add Classroom"}</Typography>{error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}<Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 900 }}><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
    <TextField required label="Room Number" value={form.room_number} onChange={(e) => set("room_number", e.target.value)} /><TextField required label="Building" value={form.building} onChange={(e) => set("building", e.target.value)} />
    <TextField required type="number" label="Floor" value={form.floor} onChange={(e) => set("floor", Number(e.target.value))} /><TextField required type="number" label="Capacity" value={form.capacity} onChange={(e) => set("capacity", Number(e.target.value))} />
    <TextField select required label="Room Type" value={form.room_type} onChange={(e) => set("room_type", e.target.value as Classroom["room_type"])}><MenuItem value="CLASSROOM">Classroom</MenuItem><MenuItem value="LAB">Lab</MenuItem><MenuItem value="SEMINAR">Seminar</MenuItem></TextField>
    <TextField select required label="Status" value={form.status} onChange={(e) => set("status", e.target.value as Classroom["status"])}><MenuItem value="AVAILABLE">Available</MenuItem><MenuItem value="OCCUPIED">Occupied</MenuItem></TextField>
  </Box><Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}><Button variant="outlined" onClick={() => navigate("/admin/classrooms")}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Classroom"}</Button></Box></Paper></Box>;
}
