import {
  Dashboard,
  People,
  MenuBook,
  MeetingRoom,
  AccessTime,
  CalendarMonth,
  Logout,
} from "@mui/icons-material";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 250;

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Dashboard />,
  },
  {
    label: "Teachers",
    path: "/admin/teachers",
    icon: <People />,
  },
  {
    label: "Subjects",
    path: "/admin/subjects",
    icon: <MenuBook />,
  },
  {
    label: "Classrooms",
    path: "/admin/classrooms",
    icon: <MeetingRoom />,
  },
  {
    label: "Time Slots",
    path: "/admin/timeslots",
    icon: <AccessTime />,
  },
  {
    label: "Timetable",
    path: "/admin/timetable",
    icon: <CalendarMonth />,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/auth/login", { replace: true });
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          Schedulix
        </Typography>
      </Toolbar>

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,

              "&.active": {
                backgroundColor: "action.selected",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mt: 2,
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default Sidebar;
