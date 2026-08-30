import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function AddTeacher() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log(data);

    // No backend yet.
    // Later this will send data to PHP.

    alert("Teacher form submitted successfully!");

    navigate("/admin/teachers");
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Add Teacher
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Add a faculty member to Schedulix.
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 4,
          maxWidth: 800,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          {/* First Name */}

          <TextField
            label="First Name"
            {...register("firstName", {
              required: "First name is required",

              pattern: {
                value: /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
                message: "Enter a valid first name",
              },
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message.toString()}
          />

          {/* Last Name */}

          <TextField
            label="Last Name"
            {...register("lastName", {
              required: "Last name is required",

              pattern: {
                value: /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
                message: "Enter a valid last name",
              },
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message.toString()}
          />

          {/* Email */}

          <TextField
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",

              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message.toString()}
          />

          {/* Mobile */}

          <TextField
            label="Mobile Number"
            {...register("mobile", {
              required: "Mobile number is required",

              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            })}
            error={!!errors.mobile}
            helperText={errors.mobile?.message.toString()}
          />

          {/* Employee ID */}

          <TextField
            label="Employee ID"
            placeholder="EMP-1001"
            {...register("employeeId", {
              required: "Employee ID is required",

              pattern: {
                value: /^EMP-\d{4}$/,
                message: "Format must be EMP-1234",
              },
            })}
            error={!!errors.employeeId}
            helperText={errors.employeeId?.message.toString()}
          />

          {/* Department */}

          <TextField
            select
            label="Department"
            defaultValue=""
            {...register("department", {
              required: "Please select a department",
            })}
            error={!!errors.department}
            helperText={errors.department?.message.toString()}
          >
            <MenuItem value="">Select Department</MenuItem>

            <MenuItem value="Computer Science">Computer Science</MenuItem>

            <MenuItem value="Information Technology">
              Information Technology
            </MenuItem>

            <MenuItem value="Artificial Intelligence">
              Artificial Intelligence
            </MenuItem>
          </TextField>

          {/* Password */}

          <TextField
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",

              minLength: {
                value: 8,
                message: "Password must contain at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message.toString()}
          />

          {/* Confirm Password */}

          <TextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",

              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message.toString()}
          />
        </Box>

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
            onClick={() => navigate("/admin/teachers")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Add Teacher
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddTeacher;
