import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

function AddSubject() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Subject:", data);

    // Backend will be connected later.

    alert("Subject added successfully!");

    navigate("/admin/subjects");
  };

  return (
    <Box>
      {/* Page Header */}

      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Add Subject
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Add a new subject to the academic curriculum.
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
          {/* Subject Code */}

          <TextField
            label="Subject Code"
            placeholder="CS301"
            {...register("code", {
              required: "Subject code is required",

              pattern: {
                value: /^[A-Za-z]{2,5}-?\d{3}$/,
                message: "Enter a valid code e.g. CS301",
              },
            })}
            error={!!errors.code}
            helperText={errors.code?.message.toString()}
          />

          {/* Subject Name */}

          <TextField
            label="Subject Name"
            placeholder="Database Management Systems"
            {...register("name", {
              required: "Subject name is required",

              minLength: {
                value: 3,
                message: "Subject name must contain at least 3 characters",
              },

              maxLength: {
                value: 100,
                message: "Subject name cannot exceed 100 characters",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message.toString()}
          />

          {/* Semester */}

          <TextField
            select
            label="Semester"
            defaultValue=""
            {...register("semester", {
              required: "Please select a semester",
            })}
            error={!!errors.semester}
            helperText={errors.semester?.message.toString()}
          >
            <MenuItem value="">Select Semester</MenuItem>

            <MenuItem value="1">Semester 1</MenuItem>

            <MenuItem value="2">Semester 2</MenuItem>

            <MenuItem value="3">Semester 3</MenuItem>

            <MenuItem value="4">Semester 4</MenuItem>

            <MenuItem value="5">Semester 5</MenuItem>

            <MenuItem value="6">Semester 6</MenuItem>
          </TextField>

          {/* Credits */}

          <TextField
            label="Credits"
            type="number"
            {...register("credits", {
              required: "Credits are required",

              valueAsNumber: true,

              min: {
                value: 1,
                message: "Credits must be at least 1",
              },

              max: {
                value: 6,
                message: "Credits cannot exceed 6",
              },
            })}
            error={!!errors.credits}
            helperText={errors.credits?.message.toString()}
          />

          {/* Lectures per Week */}

          <TextField
            label="Lectures Per Week"
            type="number"
            {...register("lecturesPerWeek", {
              required: "Number of lectures is required",

              valueAsNumber: true,

              min: {
                value: 1,
                message: "At least 1 lecture is required",
              },

              max: {
                value: 10,
                message: "Cannot exceed 10 lectures per week",
              },
            })}
            error={!!errors.lecturesPerWeek}
            helperText={errors.lecturesPerWeek?.message.toString()}
          />

          {/* Subject Type */}

          <FormControl error={!!errors.type}>
            <FormLabel>Subject Type</FormLabel>

            <RadioGroup row>
              <FormControlLabel
                value="Theory"
                control={
                  <Radio
                    {...register("type", {
                      required: "Please select subject type",
                    })}
                  />
                }
                label="Theory"
              />

              <FormControlLabel
                value="Practical"
                control={
                  <Radio
                    {...register("type", {
                      required: "Please select subject type",
                    })}
                  />
                }
                label="Practical"
              />
            </RadioGroup>

            {errors.type && (
              <Typography variant="caption" color="error">
                {errors.type.message.toString()}
              </Typography>
            )}
          </FormControl>
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
            onClick={() => navigate("/admin/subjects")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Add Subject
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddSubject;
