import { useEffect, useMemo, useState } from "react";
import { Delete, Download, Edit, Refresh, Warning } from "@mui/icons-material";
import { Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Tooltip, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import {
  deleteTimetableEntry, generateTimetable, getClassrooms, getSections, getSubjects,
  getTeachers, getTimeSlots, getTimetable, getTimetableChanges, getTimetableGenerations,
  type Classroom, type Section, type Subject, type Teacher, type TimeSlot,
  type TimetableChange, type TimetableEntry, type TimetableGeneration,
} from "../../services/crudApi";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [rooms, setRooms] = useState<Classroom[]>([]);
  const [generations, setGenerations] = useState<TimetableGeneration[]>([]);
  const [changes, setChanges] = useState<TimetableChange[]>([]);
  const [sectionId, setSectionId] = useState("");
  const [availabilitySlot, setAvailabilitySlot] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [generating, setGenerating] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [params, setParams] = useSearchParams();
  const generationId = Number(params.get("generation_id")) || undefined;

  async function load() {
    try {
      const [loadedEntries, loadedSlots, loadedSections, loadedSubjects, loadedTeachers, loadedRooms, loadedGenerations, loadedChanges] = await Promise.all([
        getTimetable(generationId), getTimeSlots(), getSections(), getSubjects(), getTeachers(), getClassrooms(), getTimetableGenerations(), getTimetableChanges(generationId),
      ]);
      setEntries(loadedEntries); setSlots(loadedSlots); setSections(loadedSections);
      setSubjects(loadedSubjects); setTeachers(loadedTeachers); setRooms(loadedRooms);
      setGenerations(loadedGenerations); setChanges(loadedChanges);
      if (!sectionId && loadedSections[0]) setSectionId(String(loadedSections[0].section_id));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load timetable."); }
  }
  useEffect(() => { void load(); }, [generationId]);

  const selectedGeneration = generationId ?? generations.find((item) => String(item.section_id) === sectionId)?.generation_id;
  const filteredEntries = entries.filter((entry) => (!sectionId || String(entry.section_id) === sectionId) && (!selectedGeneration || entry.generation_id === selectedGeneration));
  const timeRows = useMemo(() => {
    const rows = new Set(["08:00|09:00"]);
    slots.forEach((slot) => rows.add(`${slot.start_time.slice(0, 5)}|${slot.end_time.slice(0, 5)}`));
    return [...rows].sort((a, b) => a.localeCompare(b));
  }, [slots]);
  const slotFor = (day: string, timeRow: string) => slots.find((slot) => slot.day.toUpperCase() === day && `${slot.start_time.slice(0, 5)}|${slot.end_time.slice(0, 5)}` === timeRow);
  const entryFor = (day: string, timeRow: string) => {
    const slot = slotFor(day, timeRow);
    return filteredEntries.find((entry) => entry.time_slot_id === slot?.time_slot_id);
  };
  const subjectName = (id: number) => { const item = subjects.find((subject) => subject.subject_id === id); return item ? `${item.subject_code} · ${item.subject_name}` : `Subject ${id}`; };
  const teacherName = (id: number) => { const item = teachers.find((teacher) => teacher.teacher_id === id); return item ? [item.first_name, item.last_name].filter(Boolean).join(" ") || item.employee_id : `Teacher ${id}`; };
  const roomName = (id: number) => rooms.find((room) => room.classroom_id === id)?.room_number ?? `Room ${id}`;
  const occupied = new Set(entries.filter((entry) => !availabilitySlot || String(entry.time_slot_id) === availabilitySlot).map((entry) => entry.classroom_id));
  const emptyRooms = rooms.filter((room) => room.status === "AVAILABLE" && !occupied.has(room.classroom_id));

  async function generate() {
    const section = sections.find((item) => String(item.section_id) === sectionId);
    if (!section) { setError("Select a section first."); return; }
    setGenerating(true); setError(""); setNotice("");
    try {
      const result = await generateTimetable({ section_id: section.section_id, semester: section.semester, academic_year: section.academic_year, randomize });
      setParams({ generation_id: String(result.generation_id) });
      await load();
      if (result.unscheduled.length) {
        setError(`Generated ${result.created_entries_count} entries; ${result.unscheduled.length} could not be scheduled.`);
      } else {
        setNotice(randomize
          ? `Randomized timetable generated successfully: ${result.created_entries_count} lectures scheduled (seed ${result.random_seed}).`
          : `Timetable generated successfully: ${result.created_entries_count} lectures scheduled.`);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to generate timetable."); }
    finally { setGenerating(false); }
  }
  async function remove(id: number) {
    if (!window.confirm("Remove this timetable entry?")) return;
    try { await deleteTimetableEntry(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete entry."); }
  }
  function download(name: string, content: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a");
    link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
  }
  function exportExcel() {
    const rows = [["Day", "Time", "Subject", "Teacher", "Room", "Status"]];
    days.forEach((day) => timeRows.forEach((timeRow) => {
      const [start, end] = timeRow.split("|");
      const slot = slotFor(day, timeRow);
      const entry = entryFor(day, timeRow);
      rows.push([
        day,
        `${slot?.start_time ?? `${start}:00`} - ${slot?.end_time ?? `${end}:00`}`,
        slot?.is_break ? "Lunch Break" : entry ? subjectName(entry.subject_id) : "Free",
        entry ? teacherName(entry.teacher_id) : "",
        entry ? roomName(entry.classroom_id) : "",
        slot?.is_break ? "Break" : entry ? "Scheduled" : "Free",
      ]);
    }));
    const escapeCsv = (value: string) => {
      const stringValue = String(value ?? "");
      if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n") || stringValue.includes("\r")) {
        return `"${stringValue.replaceAll("\"", "\"\"")}"`;
      }
      return stringValue;
    };
    const content = `\uFEFF${rows.map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\r\n")}`;
    download(`timetable-${sectionId || "all"}.csv`, content, "text/csv;charset=utf-8");
  }
  function exportImage() {
    const cw = 220; const tw = 115; const rh = 78; const width = tw + cw * days.length;
    const header = `<rect width="${width}" height="44" fill="#19324d"/><text x="8" y="28" fill="white" font-family="Arial" font-size="14" font-weight="bold">TIME</text>${days.map((day, i) => `<text x="${tw + i * cw + 8}" y="28" fill="white" font-family="Arial" font-size="14" font-weight="bold">${day}</text>`).join("")}`;
    const rows = timeRows.map((timeRow, row) => {
      const y = 44 + row * rh;
      const cells = days.map((day, i) => {
        const slot = slotFor(day, timeRow); const entry = entryFor(day, timeRow); const x = tw + i * cw;
        const title = slot?.is_break ? "LUNCH BREAK" : entry ? subjectName(entry.subject_id) : "FREE";
        const detail = entry ? `${teacherName(entry.teacher_id)} | ${roomName(entry.classroom_id)}` : `${formatTime(timeRow.split("|")[0])} - ${formatTime(timeRow.split("|")[1])}`;
        return `<rect x="${x}" y="${y}" width="${cw}" height="${rh}" fill="${slot?.is_break ? "#fff3cd" : "white"}" stroke="#cbd5e1"/><text x="${x + 8}" y="${y + 25}" font-family="Arial" font-size="12" font-weight="bold">${xml(title)}</text><text x="${x + 8}" y="${y + 48}" font-family="Arial" font-size="10">${xml(detail)}</text>`;
      }).join("");
      const [start, end] = timeRow.split("|");
      return `<rect x="0" y="${y}" width="${tw}" height="${rh}" fill="#f1f5f9" stroke="#cbd5e1"/><text x="8" y="${y + 25}" font-family="Arial" font-size="11">${formatTime(start)}</text><text x="8" y="${y + 46}" font-family="Arial" font-size="11">${formatTime(end)}</text>${cells}`;
    }).join("");
    download(`timetable-${sectionId || "all"}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${44 + rh * timeRows.length}"><rect width="100%" height="100%" fill="white"/>${header}${rows}</svg>`, "image/svg+xml");
  }
  function renderCell(day: string, timeRow: string) {
    const [start, end] = timeRow.split("|");
    const slot = slotFor(day, timeRow);
    const entry = entryFor(day, timeRow);
    if (!slot) return <Box sx={{ p: 1, height: "100%", bgcolor: "action.hover", borderRadius: 1 }}><Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{formatTime(start)} - {formatTime(end)}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "flex", justifyContent: "center", mt: 2 }}>Free</Typography></Box>;
    if (slot.is_break) return <Paper sx={{ p: 2, height: "100%", textAlign: "center", bgcolor: "warning.light", color: "warning.contrastText" }}><Typography variant="caption" sx={{ display: "block" }}>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</Typography><Typography sx={{ fontWeight: 700 }}>Lunch Break</Typography></Paper>;
    if (!entry) return <Box sx={{ p: 1, height: "100%", bgcolor: "action.hover", borderRadius: 1 }}><Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "flex", justifyContent: "center", mt: 2 }}>Free</Typography></Box>;
    return <Paper variant="outlined" sx={{ p: 1, height: "100%" }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{subjectName(entry.subject_id)}</Typography>
      <Typography variant="caption" sx={{ display: "block" }}>👤 {teacherName(entry.teacher_id)}</Typography>
      <Typography variant="caption" sx={{ display: "block" }}>🏫 {roomName(entry.classroom_id)}</Typography>
      <IconButton size="small" component={Link} to={`/admin/timetable/edit/${entry.timetable_id}`} color="primary"><Edit fontSize="small" /></IconButton>
      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => void remove(entry.timetable_id)}><Delete fontSize="small" /></IconButton></Tooltip>
    </Paper>;
  }

  return <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
      <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Timetable</Typography><Typography color="text.secondary">Readable weekly schedule with lunch breaks and room details.</Typography></Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}><Button variant="contained" startIcon={<Refresh />} onClick={() => void generate()} disabled={generating}>{generating ? "Generating..." : "Generate"}</Button><Button variant="outlined" startIcon={<Download />} onClick={exportExcel}>CSV</Button><Button variant="outlined" onClick={exportImage}>Image</Button></Box>
    </Box>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    {notice && <Typography color="success.main" sx={{ mb: 2 }}>{notice}</Typography>}
    {changes.length > 0 && <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "warning.main" }}><Typography variant="h6">Recent Rescheduled Changes</Typography>{changes.slice(0, 5).map((change) => { let oldValue: Partial<TimetableEntry> = {}; let newValue: Partial<TimetableEntry> = {}; try { oldValue = JSON.parse(change.old_values) as Partial<TimetableEntry>; newValue = JSON.parse(change.new_values) as Partial<TimetableEntry>; } catch { /* legacy change */ } return <Typography key={change.change_id} variant="body2">Entry #{change.timetable_id}: slot #{oldValue.time_slot_id ?? "?"} → #{newValue.time_slot_id ?? "?"}, room {oldValue.classroom_id ? roomName(oldValue.classroom_id) : "?"} → {newValue.classroom_id ? roomName(newValue.classroom_id) : "?"} · {new Date(change.changed_at).toLocaleString()}</Typography>; })}</Paper>}
    <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}><FormControl size="small" sx={{ minWidth: 220 }}><InputLabel>Section</InputLabel><Select value={sectionId} label="Section" onChange={(e) => setSectionId(e.target.value)}>{sections.map((section) => <MenuItem key={section.section_id} value={String(section.section_id)}>{section.section_name} · Semester {section.semester}</MenuItem>)}</Select></FormControl><FormControl size="small" sx={{ minWidth: 280 }}><InputLabel>Finalized timetable</InputLabel><Select value={selectedGeneration ? String(selectedGeneration) : ""} label="Finalized timetable" onChange={(e) => setParams(e.target.value ? { generation_id: e.target.value } : {})}><MenuItem value="">Latest for section</MenuItem>{generations.map((generation) => <MenuItem key={generation.generation_id} value={String(generation.generation_id)}>Generation #{generation.generation_id} · Section #{generation.section_id}</MenuItem>)}</Select></FormControl><Button variant={randomize ? "contained" : "outlined"} onClick={() => setRandomize((value) => !value)}>{randomize ? "Randomized On" : "Enable Randomization"}</Button></Paper>
    <Paper sx={{ p: 2, mb: 3 }}><Typography variant="h6">Empty Classrooms</Typography><FormControl size="small" sx={{ minWidth: 260, mt: 1 }}><InputLabel>Time slot</InputLabel><Select value={availabilitySlot} label="Time slot" onChange={(e) => setAvailabilitySlot(e.target.value)}><MenuItem value="">Select a time slot</MenuItem>{slots.filter((slot) => !slot.is_break).map((slot) => <MenuItem key={slot.time_slot_id} value={String(slot.time_slot_id)}>{slot.day} {formatTime(slot.start_time)} - {formatTime(slot.end_time)}</MenuItem>)}</Select></FormControl>{availabilitySlot && <Typography sx={{ mt: 1 }} color="text.secondary">{emptyRooms.length} available: {emptyRooms.map((room) => room.room_number).join(", ")}</Typography>}</Paper>
    <Paper sx={{ overflowX: "auto" }}><Box sx={{ minWidth: { xs: 760, md: 1250 }, display: "grid", gridTemplateColumns: { xs: "85px repeat(6, minmax(110px, 1fr))", md: "115px repeat(6, 1fr)" } }}><Box sx={{ p: { xs: 1, md: 2 }, fontWeight: 700, borderBottom: 1 }}>Time</Box>{days.map((day) => <Box key={day} sx={{ p: { xs: 1, md: 2 }, textAlign: "center", fontWeight: 700, borderBottom: 1, fontSize: { xs: "0.75rem", md: "1rem" } }}>{day}</Box>)}{timeRows.map((timeRow) => { const [start, end] = timeRow.split("|"); return <Box key={timeRow} sx={{ display: "contents" }}><Box sx={{ p: 1.5, borderBottom: 1, borderRight: 1 }}><Typography sx={{ fontWeight: 700 }} variant="body2">{formatTime(start)} - {formatTime(end)}</Typography></Box>{days.map((day) => <Box key={`${day}-${timeRow}`} sx={{ minHeight: { xs: 105, md: 115 }, p: 1, borderBottom: 1, borderRight: 1 }}>{renderCell(day, timeRow)}</Box>)}</Box>; })}</Box></Paper>
    <Box sx={{ mt: 2 }}><Chip icon={<Warning />} label="Lunch breaks and all six weekdays are included in exports." size="small" /></Box>
  </Box>;
}

function formatTime(value: string) { const [hours, minutes] = value.split(":").map(Number); return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
function xml(value: string) { return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[character] ?? character); }
