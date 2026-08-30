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
  Typography,
  Tooltip,
} from "@mui/material";

import { Add, Delete, Edit, Search } from "@mui/icons-material";

import { subjects as initialSubjects } from "../../utils/mockData";

function Subjects() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [search, setSearch] = useState("");

  // Search
  const filteredSubjects = subjects.filter((subject) => {
    const searchText = search.toLowerCase();

    return (
      subject.code.toLowerCase().includes(searchText) ||
      subject.name.toLowerCase().includes(searchText) ||
      subject.type.toLowerCase().includes(searchText)
    );
  });

  // Delete
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?",
    );

    if (!confirmed) return;

    setSubjects((currentSubjects) =>
      currentSubjects.filter((subject) => subject.id !== id),
    );
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
            Subjects
          </Typography>

          <Typography color="text.secondary">
            Manage subjects offered by the institution.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/admin/subjects/add"
          variant="contained"
          startIcon={<Add />}
        >
          Add Subject
        </Button>
      </Box>

      {/* Search */}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by subject code, name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ mr: 1 }} />,
            },
          }}
        />
      </Paper>

      {/* Table */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Code</strong>
              </TableCell>

              <TableCell>
                <strong>Subject Name</strong>
              </TableCell>

              <TableCell>
                <strong>Semester</strong>
              </TableCell>

              <TableCell>
                <strong>Credits</strong>
              </TableCell>

              <TableCell>
                <strong>Type</strong>
              </TableCell>

              <TableCell>
                <strong>Lectures / Week</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <TableRow key={subject.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {subject.code}
                    </Typography>
                  </TableCell>

                  <TableCell>{subject.name}</TableCell>

                  <TableCell>Semester {subject.semester}</TableCell>

                  <TableCell>{subject.credits}</TableCell>

                  <TableCell>
                    <Chip
                      label={subject.type}
                      color={
                        subject.type === "Practical" ? "secondary" : "primary"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{subject.lecturesPerWeek}</TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit Subject">
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/admin/subjects/edit/${subject.id}`}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Subject">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(subject.id)}
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
                    No subjects found.
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

export default Subjects;
