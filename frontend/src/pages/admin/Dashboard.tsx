import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Paper,
} from "@mui/material";

import {
  People,
  MenuBook,
  MeetingRoom,
  CalendarMonth,
} from "@mui/icons-material";

const stats = [
  {
    title: "Teachers",
    value: "42",
    icon: <People />,
  },
  {
    title: "Subjects",
    value: "68",
    icon: <MenuBook />,
  },
  {
    title: "Classrooms",
    value: "24",
    icon: <MeetingRoom />,
  },
  {
    title: "Scheduled Lectures",
    value: "186",
    icon: <CalendarMonth />,
  },
];

function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your timetable.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
            key={stat.title}
          >
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {stat.icon}

                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>

                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Scheduling Overview
            </Typography>

            <Typography color="text.secondary">
              Current timetable generation status
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Chip label="Schedule Ready" color="success" />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Conflicts
            </Typography>

            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              3
            </Typography>

            <Typography color="text.secondary">
              Scheduling conflicts detected
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
