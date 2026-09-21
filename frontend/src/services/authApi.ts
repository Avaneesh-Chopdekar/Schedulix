const API_BASE_URL = "http://localhost:8080";

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  role: "ADMIN" | "FACULTY" | "STUDENT";
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
  role: "FACULTY" | "STUDENT";
  department_id: number;
  employee_id?: string;
  designation?: string;
  employment_type?: string;
  roll_number?: string;
  section_id?: number;
  admission_year?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

interface MeResponse {
  success: boolean;
  user: User;
}

interface DashboardResponse {
  success: boolean;
  data: {
    departments: number;
    teachers: number;
    students: number;
    subjects: number;
    classrooms: number;
    sections: number;
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function login(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      email,
      password,
      remember_me: rememberMe,
    }),
  });

  return handleResponse<LoginResponse>(response);
}

export async function register(data: RegisterData): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(data),
  });

  return handleResponse<ApiResponse>(response);
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await handleResponse<MeResponse>(response);

  return data.user;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  await handleResponse<ApiResponse>(response);
}

export async function getAdminDashboard() {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    method: "GET",
    credentials: "include",
  });

  const data = await handleResponse<DashboardResponse>(response);

  return data.data;
}
