import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OpenInNew } from "@mui/icons-material";
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { getTimetableGenerations, type TimetableGeneration } from "../../services/crudApi";

export default function FinalizedTimetables() {
  const [generations, setGenerations] = useState<TimetableGeneration[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void getTimetableGenerations().then(setGenerations).catch((e) => setError(e instanceof Error ? e.message : "Unable to load timetable history."));
  }, []);
  return <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Finalized Timetables</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Open a saved generation without running the scheduler again.</Typography>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper><Table><TableHead><TableRow>{["Generation", "Section", "Semester", "Academic Year", "Status", "Generated At", "Action"].map((heading) => <TableCell key={heading}><strong>{heading}</strong></TableCell>)}</TableRow></TableHead>
      <TableBody>{generations.map((generation) => <TableRow key={generation.generation_id}>
        <TableCell>#{generation.generation_id}</TableCell><TableCell>#{generation.section_id}</TableCell><TableCell>{generation.semester}</TableCell><TableCell>{generation.academic_year}</TableCell><TableCell>{generation.status}</TableCell><TableCell>{generation.generated_at ?? "—"}</TableCell>
        <TableCell><Button component={Link} to={`/admin/timetable?generation_id=${generation.generation_id}`} startIcon={<OpenInNew />}>View</Button></TableCell>
      </TableRow>)}</TableBody>
    </Table></Paper>
  </Box>;
}
