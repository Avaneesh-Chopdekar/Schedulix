import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  CheckCircleOutlined,
  EventAvailable,
  Groups2,
  Insights,
  NotificationsActive,
  Schedule,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

function Home() {
  const { user } = useAuth();
  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "FACULTY"
        ? "/faculty/dashboard"
        : user?.role === "STUDENT"
          ? "/student/dashboard"
          : "/auth/login";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Schedulix
          </Typography>

          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <ThemeToggle />
            {user ? (
              <Button component={Link} to={dashboardPath} variant="contained">
                Open dashboard
              </Button>
            ) : (
              <>
                <Button component={Link} to="/auth/login" variant="text">
                  Login
                </Button>
                <Button component={Link} to="/auth/register" variant="contained">
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Chip label="College timetable platform" sx={{ width: "fit-content" }} />
          <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "3.4rem" } }}>
            Build, publish, and update timetables without the spreadsheet chaos.
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Schedulix helps admins generate timetables, faculty track teaching slots, and students stay updated on changes in one place.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button component={Link} to={user ? dashboardPath : "/auth/register"} variant="contained" size="large">
              {user ? "Go to dashboard" : "Get started"}
            </Button>
            {!user && (
              <Button component={Link} to="/auth/login" variant="outlined" size="large">
                Sign in
              </Button>
            )}
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 6 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={1.25} sx={{ mb: 1, alignItems: "center" }}>
                <EventAvailable fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Reliable scheduling
                </Typography>
              </Stack>
              <Typography color="text.secondary">
                Generate section-wise weekly schedules with room, faculty, and slot constraints.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={1.25} sx={{ mb: 1, alignItems: "center" }}>
                <Groups2 fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Role-based dashboards
                </Typography>
              </Stack>
              <Typography color="text.secondary">
                Separate workflows for admin, faculty, and students so each role sees only what matters.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={1.25} sx={{ mb: 1, alignItems: "center" }}>
                <Insights fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Academic updates
                </Typography>
              </Stack>
              <Typography color="text.secondary">
                Share timetable changes and faculty absence notices quickly so students stay informed.
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Card sx={{ mt: 6 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Why colleges use Schedulix
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CheckCircleOutlined fontSize="small" color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Faster timetable publishing
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CheckCircleOutlined fontSize="small" color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Cleaner faculty coordination
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CheckCircleOutlined fontSize="small" color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Better visibility for students
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 10 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
            A calmer way to run the week
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 4 }}>
            From planning to the classroom
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              ["01", "Set up your academic data", "Add teachers, subjects, rooms, sections, and availability once."],
              ["02", "Generate a workable timetable", "Create a balanced weekly schedule and review it before publishing."],
              ["03", "Keep everyone in sync", "Share changes, absences, and the latest schedule with the right people."],
            ].map(([number, title, description]) => (
              <Card key={number} variant="outlined" sx={{ flex: 1, bgcolor: "transparent" }}>
                <CardContent>
                  <Typography color="primary" sx={{ fontWeight: 800, letterSpacing: 1 }}>{number}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>{title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 10 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3, justifyContent: "space-between" }}>
            <Box>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>What people notice</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>Less chasing. More clarity.</Typography>
            </Box>
            <Typography color="text.secondary" sx={{ maxWidth: 360, alignSelf: { md: "end" } }}>
              Designed around the small details that make an academic week run smoothly.
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              ["“I can see the week at a glance instead of checking three different spreadsheets.”", "Student representative"],
              ["“When a lecture changes, the update is visible to the people who need it.”", "Department coordinator"],
              ["“The daily view is much easier to use between classes than a printed timetable.”", "Faculty member"],
            ].map(([quote, role]) => (
              <Card
                key={role}
                sx={{
                  flex: 1,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Typography variant="body1" sx={{ fontStyle: "italic", lineHeight: 1.7 }}>{quote}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>{role}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        <Card sx={{ mt: 10, bgcolor: "primary.main", color: "primary.contrastText" }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Make the next timetable easier.</Typography>
                <Typography sx={{ mt: 1, opacity: 0.85 }}>Bring your schedule, people, and updates into one dependable place.</Typography>
              </Box>
              <Button
                component={Link}
                to={user ? dashboardPath : "/auth/register"}
                variant="contained"
                color="inherit"
                endIcon={<ArrowForward />}
                sx={{ color: "primary.main", whiteSpace: "nowrap", alignSelf: { xs: "flex-start", md: "center" } }}
              >
                {user ? "Open dashboard" : "Start with Schedulix"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Box
        component="footer"
        sx={{
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ justifyContent: "space-between" }}>
            <Box sx={{ maxWidth: 300 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Schedulix</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                A practical timetable and academic updates platform for colleges.
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Product</Typography>
              <Stack direction="row" spacing={2}>
                <Button component={Link} to="/auth/login" size="small">Login</Button>
                <Button component={Link} to="/auth/register" size="small">Register</Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Built for campus life</Typography>
              <Stack direction="row" spacing={1.5} color="text.secondary">
                <Schedule fontSize="small" />
                <NotificationsActive fontSize="small" />
                <Groups2 fontSize="small" />
              </Stack>
            </Stack>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 4 }}>
            © {new Date().getFullYear()} Schedulix. Built for simpler academic coordination.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
