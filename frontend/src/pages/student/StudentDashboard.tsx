import { Button, Paper, Stack, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/auth/login", { replace: true });
    }
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Student Dashboard</Typography>
        <Typography color="text.secondary">
          Welcome, {user?.first_name}.
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ alignSelf: "flex-start" }}
        >
          Logout
        </Button>
      </Stack>
    </Paper>
  );
}
