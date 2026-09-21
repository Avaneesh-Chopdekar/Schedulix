import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";

import { NotificationsNone } from "@mui/icons-material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 250;

function Navbar() {
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
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <NotificationsNone />
          </IconButton>

          <Avatar>{user?.first_name?.charAt(0).toUpperCase() ?? "U"}</Avatar>

          <Box>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              {user ? `${user.first_name} ${user.last_name}` : "User"}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {user?.role ?? ""}
            </Typography>
          </Box>

          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
