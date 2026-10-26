import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import {
  getClassrooms, getSections, getSubjects, getTeachers, getTimeSlots,
  getTimetable, updateTimetableEntry, type Classroom, type Section,
  type Subject, type Teacher, type TimeSlot, type TimetableEntry,
} from "../../services/crudApi";

export default function EditTimetable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<TimetableEntry | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      getTimetable(), getSubjects(), getTeachers(), getClassrooms(), getTimeSlots(), getSections(),
    ]).then(([entries, loadedSubjects, loadedTeachers, loadedClassrooms, loadedSlots, loadedSections]) => {
      setEntry(entries.find((item) => item.timetable_id === Number(id)) ?? null);
      setSubjects(loadedSubjects); setTeachers(loadedTeachers); setClassrooms(loadedClassrooms);
      setSlots(loadedSlots.filter((slot) => !slot.is_break)); setSections(loadedSections);
    }).catch((e) => setError(e instanceof Error ? e.message : "Unable to load timetable entry."));
  }, [id]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!entry) return;
    setSaving(true); setError("");
    try {
      const { timetable_id: _, ...data } = entry;
      await updateTimetableEntry(entry.timetable_id, data);
      navigate("/admin/timetable");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to reschedule entry.");
    } finally { setSaving(false); }
  }

  if (!entry) return <Typography color={error ? "error" : "text.secondary"}>{error || "Loading timetable entry..."}</Typography>;
  return <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Reschedule Timetable Entry</Typography>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 700 }}>
      <Box sx={{ display: "grid", gap: 2 }}>
        <SelectField label="Subject" value={entry.subject_id} options={subjects.map((item) => [item.subject_id, `${item.subject_code} - ${item.subject_name}`])} onChange={(value) => setEntry({ ...entry, subject_id: value })} />
        <SelectField label="Teacher" value={entry.teacher_id} options={teachers.map((item) => [item.teacher_id, `${item.employee_id} - ${item.designation}`])} onChange={(value) => setEntry({ ...entry, teacher_id: value })} />
        <SelectField label="Classroom" value={entry.classroom_id} options={classrooms.map((item) => [item.classroom_id, `${item.room_number} - ${item.room_type}`])} onChange={(value) => setEntry({ ...entry, classroom_id: value })} />
        <SelectField label="Time slot" value={entry.time_slot_id} options={slots.map((item) => [item.time_slot_id, `${item.day} ${item.start_time} - ${item.end_time}`])} onChange={(value) => setEntry({ ...entry, time_slot_id: value })} />
        <SelectField label="Section" value={entry.section_id} options={sections.map((item) => [item.section_id, item.section_name])} onChange={(value) => setEntry({ ...entry, section_id: value })} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/admin/timetable")}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Reschedule"}</Button>
      </Box>
    </Paper>
  </Box>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: number; options: Array<[number, string]>; onChange: (value: number) => void }) {
  return <TextField select required label={label} value={value} onChange={(event) => onChange(Number(event.target.value))}>
    {options.map(([optionValue, optionLabel]) => <MenuItem key={optionValue} value={optionValue}>{optionLabel}</MenuItem>)}
  </TextField>;
}
