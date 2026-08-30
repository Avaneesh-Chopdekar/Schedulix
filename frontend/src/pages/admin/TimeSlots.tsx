import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { AccessTime, Add, Delete, Edit, Search } from "@mui/icons-material";

import { timeSlots as initialTimeSlots } from "../../utils/mockData";

function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);

  const [search, setSearch] = useState("");

  // Search
  const filteredTimeSlots = timeSlots.filter((slot) => {
    const value = search.toLowerCase();

    return (
      slot.day.toLowerCase().includes(value) ||
      slot.startTime.includes(value) ||
      slot.endTime.includes(value) ||
      slot.slotNumber.toString().includes(value)
    );
  });

  // Delete
  const handleDelete = (id) => {
    const slot = timeSlots.find((slot) => slot.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete Slot ${slot.slotNumber} on ${slot.day}?`,
    );

    if (!confirmed) return;

    setTimeSlots((current) => current.filter((slot) => slot.id !== id));
  };

  return (
    <Box>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Time Slots
          </Typography>

          <Typography color="text.secondary">
            Manage the time periods available for scheduling lectures.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/admin/timeslots/add"
          variant="contained"
          startIcon={<Add />}
        >
          Add Time Slot
        </Button>
      </Box>

      {/* Search */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by day, slot number or time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <Search
                  sx={{
                    mr: 1,
                    color: "text.secondary",
                  }}
                />
              ),
            },
          }}
        />
      </Paper>

      {/* Table */}

      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Slot</strong>
              </TableCell>

              <TableCell>
                <strong>Day</strong>
              </TableCell>

              <TableCell>
                <strong>Start Time</strong>
              </TableCell>

              <TableCell>
                <strong>End Time</strong>
              </TableCell>

              <TableCell>
                <strong>Duration</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTimeSlots.length > 0 ? (
              filteredTimeSlots.map((slot) => (
                <TableRow key={slot.id} hover>
                  <TableCell>
                    <Chip
                      icon={<AccessTime />}
                      label={`Slot ${slot.slotNumber}`}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{slot.day}</Typography>
                  </TableCell>

                  <TableCell>{formatTime(slot.startTime)}</TableCell>

                  <TableCell>{formatTime(slot.endTime)}</TableCell>

                  <TableCell>
                    {calculateDuration(slot.startTime, slot.endTime)} minutes
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit Time Slot">
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/admin/timeslots/edit/${slot.id}`}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Time Slot">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(slot.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No time slots found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Convert 24-hour time to 12-hour display

function formatTime(time) {
  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Calculate duration

function calculateDuration(start, end) {
  const [startHours, startMinutes] = start.split(":").map(Number);

  const [endHours, endMinutes] = end.split(":").map(Number);

  const startTotal = startHours * 60 + startMinutes;

  const endTotal = endHours * 60 + endMinutes;

  return endTotal - startTotal;
}

export default TimeSlots;
