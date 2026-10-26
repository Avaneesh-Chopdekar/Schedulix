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
import { register as registerTeacher } from "../../services/authApi";

type TeacherFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  employeeId: string;
  department: string;
  designation: string;
  employmentType: string;
  password: string;
  confirmPassword: string;
};

function AddTeacher() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TeacherFormValues>();

  const password = watch("password");

  const onSubmit = async (data: TeacherFormValues) => {
    try {
      await registerTeacher({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        mobile_number: data.mobile,
        password: data.password,
        role: "FACULTY",
        department_id: Number(data.department),
        employee_id: data.employeeId,
        designation: data.designation ?? "Faculty",
        employment_type: data.employmentType ?? "FULL_TIME",
      });
      navigate("/admin/teachers");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to create teacher.");
    }
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
            helperText={errors.firstName?.message ?? ""}
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
            helperText={errors.lastName?.message ?? ""}
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
            helperText={errors.email?.message ?? ""}
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
            helperText={errors.mobile?.message ?? ""}
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
            helperText={errors.employeeId?.message ?? ""}
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
            helperText={errors.department?.message ?? ""}
          >
            <MenuItem value="">Select Department</MenuItem>

            <MenuItem value="1">Computer Science</MenuItem>

            <MenuItem value="2">
              Information Technology
            </MenuItem>

            <MenuItem value="3">
              Artificial Intelligence
            </MenuItem>
          </TextField>

          <TextField
            label="Designation"
            defaultValue="Faculty"
            {...register("designation", { required: "Designation is required" })}
            error={!!errors.designation}
            helperText={errors.designation?.message ?? ""}
          />

          <TextField
            label="Employment Type"
            defaultValue="FULL_TIME"
            {...register("employmentType", {
              required: "Employment type is required",
            })}
            error={!!errors.employmentType}
            helperText={errors.employmentType?.message ?? ""}
          />

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
            helperText={errors.password?.message ?? ""}
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
            helperText={errors.confirmPassword?.message ?? ""}
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
