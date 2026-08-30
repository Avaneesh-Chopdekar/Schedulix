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

import { classrooms as initialClassrooms } from "../../utils/mockData";

function Classrooms() {
  const [classrooms, setClassrooms] = useState(initialClassrooms);

  const [search, setSearch] = useState("");

  const filteredClassrooms = classrooms.filter((room) => {
    const value = search.toLowerCase();

    return (
      room.roomNumber.toLowerCase().includes(value) ||
      room.building.toLowerCase().includes(value) ||
      room.type.toLowerCase().includes(value)
    );
  });

  const handleDelete = (id) => {
    const room = classrooms.find((room) => room.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete room ${room.roomNumber}?`,
    );

    if (!confirmed) return;

    setClassrooms((current) => current.filter((room) => room.id !== id));
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
            Classrooms
          </Typography>

          <Typography color="text.secondary">
            Manage classrooms, laboratories and other teaching spaces.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/admin/classrooms/add"
          variant="contained"
          startIcon={<Add />}
        >
          Add Classroom
        </Button>
      </Box>

      {/* Search */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by room number, building or type..."
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
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Room</strong>
              </TableCell>

              <TableCell>
                <strong>Building</strong>
              </TableCell>

              <TableCell>
                <strong>Floor</strong>
              </TableCell>

              <TableCell>
                <strong>Capacity</strong>
              </TableCell>

              <TableCell>
                <strong>Type</strong>
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
            {filteredClassrooms.length > 0 ? (
              filteredClassrooms.map((room) => (
                <TableRow key={room.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {room.roomNumber}
                    </Typography>
                  </TableCell>

                  <TableCell>{room.building}</TableCell>

                  <TableCell>Floor {room.floor}</TableCell>

                  <TableCell>{room.capacity} seats</TableCell>

                  <TableCell>
                    <Chip
                      label={room.type}
                      size="small"
                      color={
                        room.type === "Laboratory" ? "secondary" : "primary"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={room.status}
                      size="small"
                      color={
                        room.status === "Available" ? "success" : "warning"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit Classroom">
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/admin/classrooms/edit/${room.id}`}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Classroom">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(room.id)}
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
                    No classrooms found.
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

export default Classrooms;
