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

function AddTimeSlot() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const onSubmit = (data) => {
    console.log("Time Slot:", data);

    alert("Time slot added successfully!");

    navigate("/admin/timeslots");
  };

  return (
    <Box>
      {/* Header */}

      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Add Time Slot
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Define a time period available for lectures.
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
          {/* Day */}

          <TextField
            select
            label="Day"
            defaultValue=""
            {...register("day", {
              required: "Please select a day",
            })}
            error={!!errors.day}
            helperText={errors.day?.message.toString()}
          >
            <MenuItem value="">Select Day</MenuItem>

            <MenuItem value="Monday">Monday</MenuItem>

            <MenuItem value="Tuesday">Tuesday</MenuItem>

            <MenuItem value="Wednesday">Wednesday</MenuItem>

            <MenuItem value="Thursday">Thursday</MenuItem>

            <MenuItem value="Friday">Friday</MenuItem>

            <MenuItem value="Saturday">Saturday</MenuItem>
          </TextField>

          {/* Slot Number */}

          <TextField
            label="Slot Number"
            type="number"
            placeholder="1"
            {...register("slotNumber", {
              required: "Slot number is required",

              valueAsNumber: true,

              min: {
                value: 1,
                message: "Slot number must be at least 1",
              },

              max: {
                value: 12,
                message: "Slot number cannot exceed 12",
              },
            })}
            error={!!errors.slotNumber}
            helperText={errors.slotNumber?.message.toString()}
          />

          {/* Start Time */}

          <TextField
            label="Start Time"
            type="time"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            {...register("startTime", {
              required: "Start time is required",
            })}
            error={!!errors.startTime}
            helperText={errors.startTime?.message.toString()}
          />

          {/* End Time */}

          <TextField
            label="End Time"
            type="time"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            {...register("endTime", {
              required: "End time is required",

              validate: (value) => {
                if (!startTime) {
                  return "Enter start time first";
                }

                if (value <= startTime) {
                  return "End time must be after start time";
                }

                return true;
              },
            })}
            error={!!errors.endTime}
            helperText={errors.endTime?.message.toString()}
          />
        </Box>

        {/* Information */}

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Example: A time slot from 09:00 to 10:00 represents one scheduling
            period.
          </Typography>
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
            onClick={() => navigate("/admin/timeslots")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Add Time Slot
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddTimeSlot;
