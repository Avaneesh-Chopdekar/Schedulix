import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  CalendarMonth,
  Email,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  login,
  register,
  type RegisterData,
} from "../../services/authApi";

import "./AuthPage.css";

type AuthMode = "login" | "register";

type AccountType = "FACULTY" | "STUDENT";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  accountType?: string;
  departmentId?: string;
  employeeId?: string;
  designation?: string;
  employmentType?: string;
  rollNumber?: string;
  sectionId?: string;
  admissionYear?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface Department {
  department_id: number;
  department_name: string;
}

const departments: Department[] = [
  {
    department_id: 1,
    department_name: "Computer Engineering",
  },
  {
    department_id: 2,
    department_name: "Information Technology",
  },
  {
    department_id: 3,
    department_name: "Artificial Intelligence & Data Science",
  },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialMode: AuthMode =
    location.pathname === "/auth/register" ? "register" : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState("");

  /*
   * Login state
   */
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  /*
   * Registration state
   */
  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");

  const [accountType, setAccountType] = useState<AccountType | "">("");

  const [departmentId, setDepartmentId] = useState<number | "">("");

  const [employeeId, setEmployeeId] = useState("");
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  function switchMode(newMode: AuthMode) {
    setMode(newMode);

    setServerError("");
    setErrors({});

    if (newMode === "login") {
      navigate("/auth/login", {
        replace: true,
      });
    } else {
      navigate("/auth/register", {
        replace: true,
      });
    }
  }

  function validateLogin(): boolean {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function validateRegister(): boolean {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must contain at least 2 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must contain at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (!accountType) {
      newErrors.accountType = "Please select an account type";
    }

    if (!departmentId) {
      newErrors.departmentId = "Please select your department";
    }

    if (accountType === "FACULTY") {
      if (!employeeId.trim()) newErrors.employeeId = "Employee ID is required";
      if (!designation.trim()) newErrors.designation = "Designation is required";
      if (!employmentType.trim()) {
        newErrors.employmentType = "Employment type is required";
      }
    }

    if (accountType === "STUDENT") {
      if (!rollNumber.trim()) newErrors.rollNumber = "Roll number is required";
      if (!sectionId.trim()) newErrors.sectionId = "Section is required";
      if (!admissionYear.trim()) {
        newErrors.admissionYear = "Admission year is required";
      }
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(password);

      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setServerError("");

    if (!validateLogin()) {
      return;
    }

    try {
      setLoading(true);

      /*
       * We don't need separate frontend login
       * implementations for each role.
       *
       * The backend determines the user's role.
       */
      const response = await login(email.trim(), password, rememberMe);

      if (!response.user) {
        throw new Error("Invalid login response.");
      }

      switch (response.user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        case "FACULTY":
          navigate("/faculty/dashboard");
          break;

        case "STUDENT":
          navigate("/student/dashboard");
          break;

        default:
          throw new Error("Unknown account role.");
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setServerError("");

    if (!validateRegister()) {
      return;
    }

    try {
      setLoading(true);

      const data: RegisterData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        mobile_number: mobileNumber.trim(),
        password,
        role: accountType as AccountType,
        department_id: departmentId as number,
        ...(accountType === "FACULTY"
          ? {
              employee_id: employeeId.trim(),
              designation: designation.trim(),
              employment_type: employmentType.trim(),
            }
          : {
              roll_number: rollNumber.trim(),
              section_id: Number(sectionId),
              admission_year: Number(admissionYear),
            }),
      };

      await register(data);

      /*
       * Registration successful.
       * Send user back to login.
       */
      switchMode("login");

      setPassword("");
      setConfirmPassword("");

      setServerError("Account created successfully. Please sign in.");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleMobileChange(value: string) {
    /*
     * Allow digits only.
     */
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 10) {
      setMobileNumber(cleaned);
    }
  }

  return (
    <Box className="auth-page">
      <Paper
        elevation={3}
        className={
          mode === "register" ? "auth-card auth-card-register" : "auth-card"
        }
      >
        {/* Logo */}
        <Box className="auth-logo">
          <CalendarMonth />
        </Box>

        {/* Heading */}
        <Typography variant="h4" className="auth-title">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </Typography>

        <Typography variant="body1" className="auth-subtitle">
          {mode === "login"
            ? "Sign in to your Schedulix account"
            : "Register for your Schedulix account"}
        </Typography>

        {serverError && (
          <Alert
            severity={
              serverError.includes("successfully") ? "success" : "error"
            }
            sx={{ mb: 2 }}
          >
            {serverError}
          </Alert>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <Stack spacing={2.2}>
              <TextField
                fullWidth
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                autoComplete="email"
                slotProps={{ input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                autoComplete="current-password"
                slotProps={{ input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  ),
                }}}
              />

              <Box className="remember-row">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                  }
                  label="Remember me"
                />

                <Button variant="text" size="small" disabled>
                  Forgot password?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "SIGN IN"
                )}
              </Button>

              <Divider />

              <Typography sx={{ textAlign: "center" }} variant="body2">
                Don't have an account?{" "}
                <Button variant="text" onClick={() => switchMode("register")}>
                  Create account
                </Button>
              </Typography>
            </Stack>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              {/* First + Last name */}

              <Box className="name-row">
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  slotProps={{ input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}}
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Box>

              {/* Email + Mobile */}

              <Box className="name-row">
                <TextField
                  fullWidth
                  label="Email Address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  type="email"
                  slotProps={{ input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}}
                />

                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(event) => handleMobileChange(event.target.value)}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  placeholder="9876543210"
                  slotProps={{ input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}}
                />
              </Box>

              {/* Account type + Department */}

              <Box className="name-row">
                <FormControl fullWidth error={!!errors.accountType}>
                  <InputLabel>Account Type</InputLabel>

                  <Select
                    value={accountType}
                    label="Account Type"
                    onChange={(event) =>
                      setAccountType(event.target.value as AccountType)
                    }
                  >
                    <MenuItem value="STUDENT">Student</MenuItem>

                    <MenuItem value="FACULTY">Faculty</MenuItem>
                  </Select>

                  {errors.accountType && (
                    <FormHelperText>{errors.accountType}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={!!errors.departmentId}>
                  <InputLabel>Department</InputLabel>

                  <Select
                    value={departmentId}
                    label="Department"
                    onChange={(event) =>
                      setDepartmentId(event.target.value as number)
                    }
                  >
                    {departments.map((department) => (
                      <MenuItem
                        key={department.department_id}
                        value={department.department_id}
                      >
                        {department.department_name}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors.departmentId && (
                    <FormHelperText>{errors.departmentId}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              {accountType === "FACULTY" && (
                <Box className="name-row">
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={employeeId}
                    onChange={(event) => setEmployeeId(event.target.value)}
                    error={!!errors.employeeId}
                    helperText={errors.employeeId}
                  />
                  <TextField
                    fullWidth
                    label="Designation"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                    error={!!errors.designation}
                    helperText={errors.designation}
                  />
                  <TextField
                    fullWidth
                    label="Employment Type"
                    placeholder="Full-time"
                    value={employmentType}
                    onChange={(event) => setEmploymentType(event.target.value)}
                    error={!!errors.employmentType}
                    helperText={errors.employmentType}
                  />
                </Box>
              )}

              {accountType === "STUDENT" && (
                <Box className="name-row">
                  <TextField
                    fullWidth
                    label="Roll Number"
                    value={rollNumber}
                    onChange={(event) => setRollNumber(event.target.value)}
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber}
                  />
                  <TextField
                    fullWidth
                    label="Section ID"
                    type="number"
                    value={sectionId}
                    onChange={(event) => setSectionId(event.target.value)}
                    error={!!errors.sectionId}
                    helperText={errors.sectionId}
                  />
                  <TextField
                    fullWidth
                    label="Admission Year"
                    type="number"
                    value={admissionYear}
                    onChange={(event) => setAdmissionYear(event.target.value)}
                    error={!!errors.admissionYear}
                    helperText={errors.admissionYear}
                  />
                </Box>
              )}

              {/* Password */}

              <Box className="name-row">
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  error={!!errors.password}
                  helperText={
                    errors.password ||
                    "At least 8 characters with uppercase, lowercase and number"
                  }
                  slotProps={{ input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  slotProps={{ input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}}
                />
              </Box>

              {/* Terms */}

              <FormControl error={!!errors.terms}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(event) =>
                        setTermsAccepted(event.target.checked)
                      }
                    />
                  }
                  label="I agree to the Terms and Conditions"
                />

                {errors.terms && (
                  <FormHelperText>{errors.terms}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "CREATE ACCOUNT"
                )}
              </Button>

              <Divider />

              <Typography sx={{ textAlign: "center" }} variant="body2">
                Already have an account?{" "}
                <Button variant="text" onClick={() => switchMode("login")}>
                  Sign in
                </Button>
              </Typography>
            </Stack>
          </form>
        )}
      </Paper>
    </Box>
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain a number";
  }

  return null;
}
