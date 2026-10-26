import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { CalendarMonth, MeetingRoom, MenuBook, People } from "@mui/icons-material";
import {
  getClassrooms,
  getSections,
  getSubjects,
  getTeachers,
  getTimetable,
  getTimetableGenerations,
  type Classroom,
  type Section,
  type Subject,
  type Teacher,
  type TimetableEntry,
  type TimetableGeneration,
} from "../../services/crudApi";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [generations, setGenerations] = useState<TimetableGeneration[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getTeachers(),
      getSubjects(),
      getClassrooms(),
      getSections(),
      getTimetable(),
      getTimetableGenerations(),
    ])
      .then(([loadedTeachers, loadedSubjects, loadedClassrooms, loadedSections, loadedEntries, loadedGenerations]) => {
        setTeachers(loadedTeachers);
        setSubjects(loadedSubjects);
        setClassrooms(loadedClassrooms);
        setSections(loadedSections);
        setEntries(loadedEntries);
        setGenerations(loadedGenerations);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load dashboard data."));
  }, []);

  const latestGenerationBySection = useMemo(() => {
    const latest = new Map<number, number>();
    generations.forEach((generation) => {
      if (generation.status === "SUCCESS" && (!latest.has(generation.section_id) || generation.generation_id > (latest.get(generation.section_id) ?? 0))) {
        latest.set(generation.section_id, generation.generation_id);
      }
    });
    return latest;
  }, [generations]);

  const currentEntries = useMemo(
    () => entries.filter((entry) => latestGenerationBySection.get(entry.section_id) === entry.generation_id),
    [entries, latestGenerationBySection],
  );
  const teacherName = (id: number) => {
    const teacher = teachers.find((item) => item.teacher_id === id);
    return teacher ? `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim() || teacher.employee_id : "Unassigned";
  };
  const sectionName = (id: number) => sections.find((item) => item.section_id === id)?.section_name ?? "Unknown section";
  const latestGeneration = generations.slice().sort((a, b) => b.generation_id - a.generation_id)[0];
  const stats = [
    { title: "Teachers", value: teachers.length, icon: <People /> },
    { title: "Subjects", value: subjects.length, icon: <MenuBook /> },
    { title: "Classrooms", value: classrooms.length, icon: <MeetingRoom /> },
    { title: "Current lectures", value: currentEntries.length, icon: <CalendarMonth /> },
  ];
  const teacherRecords = useMemo(() => {
    const grouped = new Map<number, TimetableEntry[]>();
    currentEntries.forEach((entry) => grouped.set(entry.teacher_id, [...(grouped.get(entry.teacher_id) ?? []), entry]));
    return [...grouped.entries()].sort((a, b) => teacherName(a[0]).localeCompare(teacherName(b[0])));
  }, [currentEntries, teachers]);
  const workloadChart = teacherRecords
    .map(([teacherId, records]) => ({ label: teacherName(teacherId), value: records.length }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const sectionDistribution = useMemo(() => {
    const counts = new Map<number, number>();
    currentEntries.forEach((entry) => counts.set(entry.section_id, (counts.get(entry.section_id) ?? 0) + 1));
    return [...counts.entries()]
      .map(([sectionId, value]) => ({ label: sectionName(sectionId), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [currentEntries, sections]);
  const maxWorkload = Math.max(...workloadChart.map((item) => item.value), 1);
  const maxSectionCount = Math.max(...sectionDistribution.map((item) => item.value), 1);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>A live overview of your academic timetable and teaching assignments.</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card><CardContent><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {stat.icon}<Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
            </Box><Typography color="text.secondary" sx={{ mt: 2 }}>{stat.title}</Typography></CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Scheduling overview</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {latestGeneration ? `Latest generation #${latestGeneration.generation_id} was created for section ${sectionName(latestGeneration.section_id)}.` : "No timetable generation has been created yet."}
            </Typography>
            <Chip sx={{ mt: 2 }} label={currentEntries.length ? "Schedule ready" : "Needs setup"} color={currentEntries.length ? "success" : "warning"} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box><Typography variant="h6" sx={{ fontWeight: 700 }}>Teacher class record</Typography><Typography variant="body2" color="text.secondary">Select a teacher to view their complete weekly workload.</Typography></Box>
              <Chip label={`${teacherRecords.length} teachers`} size="small" />
            </Stack>
            {teacherRecords.length === 0 ? <Typography color="text.secondary">Generate a timetable to see teacher assignments.</Typography> :
              <Grid container spacing={1.5}>
                {teacherRecords.map(([teacherId, records]) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={teacherId}>
                    <Card
                      component={Link}
                      to={`/admin/teaching-assignments?teacher_id=${teacherId}`}
                      variant="outlined"
                      sx={{ display: "block", textDecoration: "none", color: "inherit", height: "100%", transition: "border-color .2s, box-shadow .2s", "&:hover": { borderColor: "primary.main", boxShadow: 2 } }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography sx={{ fontWeight: 700 }}>{teacherName(teacherId)}</Typography>
                        <Typography variant="body2" color="text.secondary">{records.length} scheduled class{records.length === 1 ? "" : "es"}</Typography>
                        <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap", gap: 0.75 }}>
                          {[...new Set(records.map((record) => sectionName(record.section_id)))].slice(0, 3).map((section) => <Chip key={section} label={section} size="small" />)}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Teacher workload</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Scheduled classes per teacher in the current timetable.</Typography>
            {workloadChart.length ? workloadChart.map((item) => (
              <Box key={item.label} sx={{ mb: 1.5 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: "75%" }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                </Stack>
                <Box sx={{ height: 9, borderRadius: 5, bgcolor: "action.hover", overflow: "hidden" }}>
                  <Box sx={{ width: `${(item.value / maxWorkload) * 100}%`, height: "100%", bgcolor: "primary.main", borderRadius: 5 }} />
                </Box>
              </Box>
            )) : <Typography color="text.secondary">Generate a timetable to see workload data.</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Section distribution</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Current scheduled lectures by section.</Typography>
            {sectionDistribution.length ? sectionDistribution.map((item) => (
              <Box key={item.label} sx={{ mb: 1.5 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                </Stack>
                <Box sx={{ height: 9, borderRadius: 5, bgcolor: "action.hover", overflow: "hidden" }}>
                  <Box sx={{ width: `${(item.value / maxSectionCount) * 100}%`, height: "100%", bgcolor: "secondary.main", borderRadius: 5 }} />
                </Box>
              </Box>
            )) : <Typography color="text.secondary">Generate a timetable to see section data.</Typography>}
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}
