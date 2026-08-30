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

import { Add, Delete, Edit, Search } from "@mui/icons-material";

import { teachers as initialTeachers } from "../../utils/mockData";

function Teachers() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState("");

  const filteredTeachers = teachers.filter((teacher) => {
    const value = search.toLowerCase();

    return (
      teacher.employeeId.toLowerCase().includes(value) ||
      teacher.name.toLowerCase().includes(value) ||
      teacher.email.toLowerCase().includes(value) ||
      teacher.department.toLowerCase().includes(value)
    );
  });

  const handleDelete = (id) => {
    const teacher = teachers.find((teacher) => teacher.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name}?`,
    );

    if (!confirmed) return;

    setTeachers((current) => current.filter((teacher) => teacher.id !== id));
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
            Teachers
          </Typography>

          <Typography color="text.secondary">
            Manage faculty members and their information.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/admin/teachers/add"
          variant="contained"
          startIcon={<Add />}
        >
          Add Teacher
        </Button>
      </Box>

      {/* Search */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by ID, name, email or department..."
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
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Employee ID</strong>
              </TableCell>

              <TableCell>
                <strong>Name</strong>
              </TableCell>

              <TableCell>
                <strong>Email</strong>
              </TableCell>

              <TableCell>
                <strong>Mobile</strong>
              </TableCell>

              <TableCell>
                <strong>Department</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {teacher.employeeId}
                    </Typography>
                  </TableCell>

                  <TableCell>{teacher.name}</TableCell>

                  <TableCell>{teacher.email}</TableCell>

                  <TableCell>{teacher.mobile}</TableCell>

                  <TableCell>{teacher.department}</TableCell>

                  <TableCell>
                    <Chip
                      label={teacher.status}
                      color={
                        teacher.status === "Active" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit Teacher">
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/admin/teachers/edit/${teacher.id}`}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Teacher">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(teacher.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No teachers found.
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

export default Teachers;
