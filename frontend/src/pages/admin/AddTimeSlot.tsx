import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { createTimeSlot, getTimeSlot, updateTimeSlot, type TimeSlot } from "../../services/crudApi";

export default function AddTimeSlot() {
  const navigate = useNavigate(); const { id } = useParams(); const editing = Boolean(id);
  const [form, setForm] = useState<Omit<TimeSlot, "time_slot_id">>({ day: "MONDAY", slot_number: 1, start_time: "09:00", end_time: "10:00", is_break: false });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { if (id) void getTimeSlot(Number(id)).then(({ time_slot_id: _, ...data }) => setForm({ ...data, start_time: data.start_time.slice(0, 5), end_time: data.end_time.slice(0, 5) })).catch((e) => setError(e instanceof Error ? e.message : "Unable to load time slot.")); }, [id]);
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(""); try { const payload = { ...form, day: form.day.toUpperCase(), start_time: `${form.start_time}:00`, end_time: `${form.end_time}:00` }; if (id) await updateTimeSlot(Number(id), payload); else await createTimeSlot(payload); navigate("/admin/timeslots"); } catch (e) { setError(e instanceof Error ? e.message : "Unable to save time slot."); } finally { setSaving(false); } }
  return <Box><Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Time Slot" : "Add Time Slot"}</Typography>{error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}<Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 900 }}><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
    <TextField select required label="Day" value={form.day} onChange={(e) => set("day", e.target.value)}>{["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField><TextField required type="number" label="Slot Number" value={form.slot_number} onChange={(e) => set("slot_number", Number(e.target.value))} /><TextField required type="time" label="Start Time" value={form.start_time} onChange={(e) => set("start_time", e.target.value)} /><TextField required type="time" label="End Time" value={form.end_time} onChange={(e) => set("end_time", e.target.value)} />
  </Box><Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}><Button variant="outlined" onClick={() => navigate("/admin/timeslots")}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Time Slot"}</Button></Box></Paper></Box>;
}
