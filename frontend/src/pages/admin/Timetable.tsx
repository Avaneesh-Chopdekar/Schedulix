import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";

import { Delete, Edit, Refresh, Warning } from "@mui/icons-material";

import { timetableEntries } from "../../utils/mockData";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const slots = [
  {
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    slotNumber: 3,
    startTime: "11:15",
    endTime: "12:15",
  },
  {
    slotNumber: 4,
    startTime: "12:15",
    endTime: "13:15",
  },
  {
    slotNumber: 5,
    startTime: "14:00",
    endTime: "15:00",
  },
];

function Timetable() {
  const [semester, setSemester] = useState("3");
  const [section, setSection] = useState("A");

  const [entries, setEntries] = useState(timetableEntries);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.semester.toString() === semester && entry.section === section,
  );

  const getEntry = (day, slotNumber) => {
    return filteredEntries.find(
      (entry) => entry.day === day && entry.slotNumber === slotNumber,
    );
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this lecture?",
    );

    if (!confirmed) return;

    setEntries((current) => current.filter((entry) => entry.id !== id));
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
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Timetable
          </Typography>

          <Typography color="text.secondary">
            View and manage the generated timetable.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<Refresh />}>
          Generate Timetable
        </Button>
      </Box>

      {/* Filters */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Semester</InputLabel>

          <Select
            value={semester}
            label="Semester"
            onChange={(e) => setSemester(e.target.value)}
          >
            <MenuItem value="1">Semester 1</MenuItem>

            <MenuItem value="2">Semester 2</MenuItem>

            <MenuItem value="3">Semester 3</MenuItem>

            <MenuItem value="4">Semester 4</MenuItem>

            <MenuItem value="5">Semester 5</MenuItem>

            <MenuItem value="6">Semester 6</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Section</InputLabel>

          <Select
            value={section}
            label="Section"
            onChange={(e) => setSection(e.target.value)}
          >
            <MenuItem value="A">Section A</MenuItem>

            <MenuItem value="B">Section B</MenuItem>

            <MenuItem value="C">Section C</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Timetable Grid */}

      <Paper
        sx={{
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            minWidth: 1000,
            display: "grid",
            gridTemplateColumns: "140px repeat(5, 1fr)",
          }}
        >
          {/* Header Row */}

          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
              fontWeight: 700,
            }}
          >
            Time
          </Box>

          {days.map((day) => (
            <Box
              key={day}
              sx={{
                p: 2,
                textAlign: "center",
                fontWeight: 700,
                borderBottom: "1px solid",
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              {day}
            </Box>
          ))}

          {/* Time Rows */}

          {slots.map((slot) => (
            <React.Fragment key={slot.slotNumber}>
              {/* Time */}

              <Box
                sx={{
                  p: 1.5,
                  borderBottom: "1px solid",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatTime(slot.startTime)}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {formatTime(slot.endTime)}
                </Typography>
              </Box>

              {/* Days */}

              {days.map((day) => {
                const entry = getEntry(day, slot.slotNumber);

                return (
                  <Box
                    key={`${day}-${slot.slotNumber}`}
                    sx={{
                      minHeight: 120,
                      p: 1,
                      borderBottom: "1px solid",
                      borderRight: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {entry ? (
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          p: 1.5,
                          border: "1px solid",
                          borderColor: entry.hasConflict
                            ? "error.main"
                            : "divider",
                          borderRadius: 2,
                          position: "relative",
                        }}
                      >
                        {/* Conflict */}

                        {entry.hasConflict && (
                          <Tooltip title="Scheduling conflict detected">
                            <Warning
                              color="error"
                              fontSize="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                              }}
                            />
                          </Tooltip>
                        )}

                        {/* Subject */}

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            pr: 2,
                          }}
                        >
                          {entry.subjectCode}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mb: 1,
                          }}
                        >
                          {entry.subjectName}
                        </Typography>

                        {/* Teacher */}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                          }}
                        >
                          👤 {entry.teacher}
                        </Typography>

                        {/* Room */}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                          }}
                        >
                          🏫 Room {entry.room}
                        </Typography>

                        {/* Type */}

                        <Chip
                          label={entry.type}
                          size="small"
                          sx={{
                            mt: 1,
                          }}
                        />

                        {/* Actions */}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              component={Link}
                              to={`/admin/timetable/edit/${entry.id}`}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(entry.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    ) : (
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.disabled">
                          Free
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
      </Paper>

      {/* Legend */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        <Chip label="Theory" size="small" />

        <Chip label="Practical" size="small" />

        <Chip icon={<Warning />} label="Conflict" color="error" size="small" />
      </Box>
    </Box>
  );
}

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default Timetable;
