import type { DashboardDTO } from "../types/dashboard";

export const demoDashboard: DashboardDTO = {
  student: {
    s_id: "S001", name: "John Smith", mail_id: "john.smith@hsu.edu", gender: "M",
    dob: "2003-02-14", student_phone: "7776665550", emergency_contact: "9998887770",
    program: "BSc IT", age: 21, status: "Active", level: "Undergrad", admit_term: "Spring 2024"
  },
  courses: [
    { c_id: "C001", c_title: "Introduction to IT", c_code: "IT101", credits: 3 },
    { c_id: "C002", c_title: "Systems Analysis",   c_code: "MIS202", credits: 3 },
    { c_id: "C003", c_title: "Data Literacy",      c_code: "STAT115", credits: 3 },
  ],
  enrollments: [
    { e_id:"E001", s_id:"S001", c_id:"C001", term:"Spring 2024", registration_status:"Registered", overall_hours:40, gpa:3.5 },
    { e_id:"E002", s_id:"S001", c_id:"C002", term:"Spring 2024", registration_status:"Registered", overall_hours:40, gpa:3.5 },
    { e_id:"E003", s_id:"S001", c_id:"C003", term:"Spring 2024", registration_status:"Registered", overall_hours:36, gpa:3.5 },
  ],
  assignments: [
    { a_id:"A001", c_id:"C001", a_name:"Assignment 1 (IT)", due:"2025-03-01", max_score:100 },
    { a_id:"A002", c_id:"C002", a_name:"Midterm MIS202",   due:"2025-03-15", max_score:100 },
    { a_id:"A003", c_id:"C003", a_name:"Final STAT115",    due:"2025-04-01", max_score:100 },
  ],
  grades: [
    { g_id:"G001", s_id:"S001", a_id:"A001", submitted_date:"2025-03-01", status:"Submitted", score:90 },
    { g_id:"G002", s_id:"S001", a_id:"A002", submitted_date:"2025-03-15", status:"Submitted", score:85 },
  ],
  attendance: [
    { record_id:"AT001", s_id:"S001", c_id:"C001", attendance_pct:90 },
    { record_id:"AT002", s_id:"S001", c_id:"C002", attendance_pct:88 },
    { record_id:"AT003", s_id:"S001", c_id:"C003", attendance_pct:93 },
  ],
  financeSummary: { balance_due: 0, total_amount: 4000, next_due_date: "2025-04-20" },
  metrics: { overall_progress_pct: 0.72, gpa: 3.4, attendance_pct: 0.85, alerts_unread: 2 },
  deadlines: [
    { course_code:"MIS202", label:"Assignment 2", due_date:"2025-10-15", status:"due_soon" },
    { course_code:"IT101",  label:"Quiz 4",       due_date:"2025-10-20", status:"ok" }
  ],
  recommendations: [
    "Attend MIS202 labs; attendance <75%.",
    "Book tutoring for Systems Analysis.",
    "Enable push notifications to avoid late submissions."
  ]
};
