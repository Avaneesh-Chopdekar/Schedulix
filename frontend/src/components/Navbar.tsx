import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Button,
  Badge,
  Menu as NotificationMenu,
  MenuItem,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

import { Menu, NotificationsNone } from "@mui/icons-material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTeacherAbsences, type TeacherAbsence } from "../services/crudApi";
import ThemeToggle from "./ThemeToggle";

const drawerWidth = 250;

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const notificationsOpen = Boolean(notificationAnchor);
  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() : "";
  const displayRole = user?.role === "ADMIN" ? "Administrator" : user?.role ?? "";
  useEffect(() => {
    if (user?.role === "ADMIN") {
      void getTeacherAbsences().then(setAbsences).catch(() => setAbsences([]));
    }
  }, [user?.role]);

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
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end", px: { xs: 1.5, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: { xs: 0.75, sm: 2 }, minWidth: 0 }}>
          <IconButton onClick={onMenuClick} sx={{ display: { xs: "inline-flex", md: "none" } }} aria-label="Open navigation menu">
            <Menu />
          </IconButton>
          <IconButton
            onClick={(event) => setNotificationAnchor(event.currentTarget)}
            aria-label="Open notifications"
            aria-controls={notificationsOpen ? "notification-menu" : undefined}
            aria-haspopup="true"
          >
            <Badge color="warning" badgeContent={absences.length} invisible={user?.role !== "ADMIN" || absences.length === 0}>
              <NotificationsNone />
            </Badge>
          </IconButton>
          <ThemeToggle />

          <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>{user?.first_name?.charAt(0).toUpperCase() ?? "U"}</Avatar>

          <Box sx={{ minWidth: 0, textAlign: "right" }}>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              {displayName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {displayRole}
            </Typography>
          </Box>

          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ minWidth: { xs: 40, sm: "auto" }, px: { xs: 1, sm: 1.5 } }}
            aria-label="Logout"
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Logout</Box>
          </Button>
        </Box>
        <NotificationMenu
          id="notification-menu"
          anchorEl={notificationAnchor}
          open={notificationsOpen}
          onClose={() => setNotificationAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disabled>Notifications</MenuItem>
          <Divider />
          {user?.role === "ADMIN" && absences.length > 0
            ? absences.map((absence) => <MenuItem key={absence.absence_id} onClick={() => setNotificationAnchor(null)}>{absence.first_name} {absence.last_name} is absent on {absence.absence_date}</MenuItem>)
            : <MenuItem onClick={() => setNotificationAnchor(null)}>No new notifications.</MenuItem>}
        </NotificationMenu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
