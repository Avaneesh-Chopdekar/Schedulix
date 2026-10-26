import {
  Dashboard,
  People,
  MenuBook,
  MeetingRoom,
  AccessTime,
  CalendarMonth,
  Class,
  School,
  EventAvailable,
  Link as LinkIcon,
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
    label: "Sections",
    path: "/admin/sections",
    icon: <Class />,
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: <School />,
  },
  {
    label: "Teacher Availability",
    path: "/admin/teacher-availability",
    icon: <EventAvailable />,
  },
  {
    label: "Subject Assignments",
    path: "/admin/subject-sections",
    icon: <LinkIcon />,
  },
  {
    label: "Timetable",
    path: "/admin/timetable",
    icon: <CalendarMonth />,
  },
  {
    label: "Finalized Timetables",
    path: "/admin/timetable/finalized",
    icon: <CalendarMonth />,
  },
  {
    label: "Teaching Assignments",
    path: "/admin/teaching-assignments",
    icon: <People />,
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/auth/login", { replace: true });
    }
  }

  const content = (
    <>
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
            end
            onClick={onMobileClose}
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
    </>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export default Sidebar;
