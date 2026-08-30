import { List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <List>
      <ListItemButton component={Link} to="/admin/dashboard">
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/teachers">
        <ListItemText primary="Teachers" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/subjects">
        <ListItemText primary="Subjects" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/classrooms">
        <ListItemText primary="Classrooms" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/timeslots">
        <ListItemText primary="Time Slots" />
      </ListItemButton>

      <ListItemButton component={Link} to="/admin/timetable">
        <ListItemText primary="Timetable" />
      </ListItemButton>
    </List>
  );
}

export default Sidebar;
