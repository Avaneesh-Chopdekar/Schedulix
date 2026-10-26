import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { register } from "../../services/authApi";
import {
  getDepartments, getSections, getStudent, updateStudent,
  type Department, type Section, type Student,
} from "../../services/crudApi";

type StudentForm = Omit<Student, "student_id">;

export default function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState<StudentForm>({
    user_id: 0, roll_number: "", section_id: 0, admission_year: new Date().getFullYear(),
  });
  const [account, setAccount] = useState({ first_name: "", last_name: "", email: "", mobile_number: "", password: "", department_id: 0 });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([getDepartments(), getSections()])
      .then(([loadedDepartments, loadedSections]) => {
        setDepartments(loadedDepartments); setSections(loadedSections);
      }).catch((e) => setError(e instanceof Error ? e.message : "Unable to load student options."));
    if (id) void getStudent(Number(id)).then(({ student_id: _, ...data }) => setForm(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load student."));
  }, [id]);

  function setStudent<K extends keyof StudentForm>(key: K, value: StudentForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function setAccountField(key: keyof typeof account, value: string | number) {
    setAccount((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (id) {
        await updateStudent(Number(id), form);
      } else {
        await register({
          ...account,
          role: "STUDENT",
          section_id: form.section_id,
          roll_number: form.roll_number,
          admission_year: form.admission_year,
        });
      }
      navigate("/admin/students");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save student.");
    } finally { setSaving(false); }
  }

  return <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{editing ? "Edit Student" : "Add Student"}</Typography>
    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
    <Paper component="form" onSubmit={submit} sx={{ p: 4, maxWidth: 900 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
        {!editing && <><TextField required label="First Name" value={account.first_name} onChange={(e) => setAccountField("first_name", e.target.value)} /><TextField required label="Last Name" value={account.last_name} onChange={(e) => setAccountField("last_name", e.target.value)} /><TextField required type="email" label="Email" value={account.email} onChange={(e) => setAccountField("email", e.target.value)} /><TextField required label="Mobile Number" value={account.mobile_number} onChange={(e) => setAccountField("mobile_number", e.target.value)} /><TextField required type="password" label="Temporary Password" value={account.password} onChange={(e) => setAccountField("password", e.target.value)} /><TextField select required label="Department" value={account.department_id || ""} onChange={(e) => setAccountField("department_id", Number(e.target.value))}>{departments.map((department) => <MenuItem key={department.department_id} value={department.department_id}>{department.department_name}</MenuItem>)}</TextField></>}
        {editing && <TextField required type="number" label="User ID" value={form.user_id} onChange={(e) => setStudent("user_id", Number(e.target.value))} />}
        <TextField required label="Roll Number" value={form.roll_number} onChange={(e) => setStudent("roll_number", e.target.value)} />
        <TextField select required label="Section" value={form.section_id || ""} onChange={(e) => setStudent("section_id", Number(e.target.value))}>{sections.map((section) => <MenuItem key={section.section_id} value={section.section_id}>{section.section_name} - Semester {section.semester}</MenuItem>)}</TextField>
        <TextField required type="number" label="Admission Year" value={form.admission_year} onChange={(e) => setStudent("admission_year", Number(e.target.value))} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}><Button variant="outlined" onClick={() => navigate("/admin/students")}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save Student"}</Button></Box>
    </Paper>
  </Box>;
}
