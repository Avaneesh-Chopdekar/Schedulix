import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { teachers } from "../../utils/mockData";

function Teachers() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.employeeId}</TableCell>

                <TableCell>{teacher.name}</TableCell>

                <TableCell>{teacher.email}</TableCell>

                <TableCell>{teacher.department}</TableCell>

                <TableCell>
                  <Chip label={teacher.status} color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Teachers;
