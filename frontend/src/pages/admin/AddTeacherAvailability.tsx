import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import {
  createTeacherAvailability, getTeacherAvailabilityById, getTeachers,
  getTimeSlots, updateTeacherAvailability, type Teacher, type TimeSlot,
  type TeacherAvailability as Availability,
} from "../../services/crudApi";

type AvailabilityForm = Omit<Availability, "availability_id">;

export default function AddTeacherAvailability() {
  const navigate = useNavigate(); const { id } = useParams(); const editing = Boolean(id);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [form, setForm] = useState<AvailabilityForm>({ teacher_id: 0, time_slot_id: 0, day: "MONDAY", is_available: true });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([getTeachers(), getTimeSlots()]).then(([loadedTeachers, loadedSlots]) => {
      setTeachers(loadedTeachers); setSlots(loadedSlots);
    }).catch((e) => setError(e instanceof Error ? e.message : "Unable to load options."));
    if (id) void getTeacherAvailabilityById(Number(id)).then(({ availability_id: _, ...data }) => setForm(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load availability."));
  }, [id]);

  function set<K extends keyof AvailabilityForm>(key: K, value: AvailabilityForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, day: form.day.toUpperCase() };
      if (id) await updateTeacherAvailability(Number(id), payload);
      else await createTeacherAvailability(payload);
      navigate("/admin/teacher-availability");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save availability.");
    } finally { setSaving(false); }
  }

  return <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Availability" : "Add Availability"}</Typography>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 900 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
        <TextField select required label="Teacher" value={form.teacher_id || ""} onChange={(e) => set("teacher_id", Number(e.target.value))}>{teachers.map((teacher) => <MenuItem key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.employee_id} (User {teacher.user_id})</MenuItem>)}</TextField>
        <TextField select required label="Time Slot" value={form.time_slot_id || ""} onChange={(e) => set("time_slot_id", Number(e.target.value))}>{slots.map((slot) => <MenuItem key={slot.time_slot_id} value={slot.time_slot_id}>{slot.day} - Slot {slot.slot_number} ({slot.start_time.slice(0, 5)}-{slot.end_time.slice(0, 5)})</MenuItem>)}</TextField>
        <TextField select required label="Day" value={form.day} onChange={(e) => set("day", e.target.value)}>{["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map((day) => <MenuItem key={day} value={day}>{day}</MenuItem>)}</TextField>
        <TextField select required label="Availability" value={form.is_available ? "true" : "false"} onChange={(e) => set("is_available", e.target.value === "true")}><MenuItem value="true">Available</MenuItem><MenuItem value="false">Unavailable</MenuItem></TextField>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}><Button variant="outlined" onClick={() => navigate("/admin/teacher-availability")}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Availability"}</Button></Box>
    </Paper>
  </Box>;
}
