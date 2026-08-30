import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

function AddClassroom() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Classroom:", data);

    // Backend will be connected later.

    alert("Classroom added successfully!");

    navigate("/admin/classrooms");
  };

  return (
    <Box>
      {/* Header */}

      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Add Classroom
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Add a classroom or laboratory to the institution.
      </Typography>

      {/* Form */}

      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: {
            xs: 2,
            sm: 4,
          },
          maxWidth: 900,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 3,
          }}
        >
          {/* Room Number */}

          <TextField
            label="Room Number"
            placeholder="301 / LAB-1"
            {...register("roomNumber", {
              required: "Room number is required",

              pattern: {
                value: /^[A-Za-z0-9-]+$/,
                message: "Only letters, numbers and hyphens are allowed",
              },

              maxLength: {
                value: 10,
                message: "Room number cannot exceed 10 characters",
              },
            })}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber?.message.toString()}
          />

          {/* Building */}

          <TextField
            label="Building"
            placeholder="Main Building"
            {...register("building", {
              required: "Building name is required",

              pattern: {
                value: /^[A-Za-z0-9 ]+$/,
                message: "Building name contains invalid characters",
              },

              maxLength: {
                value: 50,
                message: "Building name cannot exceed 50 characters",
              },
            })}
            error={!!errors.building}
            helperText={errors.building?.message.toString()}
          />

          {/* Floor */}

          <TextField
            select
            label="Floor"
            defaultValue=""
            {...register("floor", {
              required: "Please select a floor",
            })}
            error={!!errors.floor}
            helperText={errors.floor?.message.toString()}
          >
            <MenuItem value="">Select Floor</MenuItem>

            <MenuItem value="Ground">Ground Floor</MenuItem>

            <MenuItem value="1">Floor 1</MenuItem>

            <MenuItem value="2">Floor 2</MenuItem>

            <MenuItem value="3">Floor 3</MenuItem>

            <MenuItem value="4">Floor 4</MenuItem>

            <MenuItem value="5">Floor 5</MenuItem>
          </TextField>

          {/* Capacity */}

          <TextField
            label="Seating Capacity"
            type="number"
            {...register("capacity", {
              required: "Capacity is required",

              valueAsNumber: true,

              min: {
                value: 1,
                message: "Capacity must be at least 1",
              },

              max: {
                value: 500,
                message: "Capacity cannot exceed 500",
              },
            })}
            error={!!errors.capacity}
            helperText={errors.capacity?.message.toString()}
          />

          {/* Room Type */}

          <TextField
            select
            label="Room Type"
            defaultValue=""
            {...register("type", {
              required: "Please select room type",
            })}
            error={!!errors.type}
            helperText={errors.type?.message.toString()}
          >
            <MenuItem value="">Select Type</MenuItem>

            <MenuItem value="Classroom">Classroom</MenuItem>

            <MenuItem value="Laboratory">Laboratory</MenuItem>

            <MenuItem value="Seminar Hall">Seminar Hall</MenuItem>

            <MenuItem value="Auditorium">Auditorium</MenuItem>
          </TextField>

          {/* Status */}

          <TextField
            select
            label="Status"
            defaultValue="Available"
            {...register("status", {
              required: "Please select status",
            })}
            error={!!errors.status}
            helperText={errors.status?.message.toString()}
          >
            <MenuItem value="Available">Available</MenuItem>

            <MenuItem value="Maintenance">Maintenance</MenuItem>
          </TextField>
        </Box>

        {/* Buttons */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/classrooms")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Add Classroom
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddClassroom;
