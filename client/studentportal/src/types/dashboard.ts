export type Student = {
  s_id: string; name: string; mail_id: string; gender: "M"|"F";
  dob: string; student_phone?: string; emergency_contact?: string;
  program: string; age: number; status: string; level: string; admit_term: string;
};

export type Course = { c_id: string; c_title: string; c_code: string; credits: number; };

export type Enrollment = {
  e_id: string; s_id: string; c_id: string; term: string;
  registration_status: string; overall_hours?: number; gpa?: number;
};

export type Assignment = { a_id: string; c_id: string; a_name: string; due: string; max_score: number; };

export type Grade = { g_id: string; s_id: string; a_id: string; submitted_date: string; status: string; score: number; };

export type Attendance = { record_id: string; s_id: string; c_id: string; week?: number; attendance_pct: number; };

export type Finance = { f_id: string; s_id: string; balance_due: number; total_amount: number; due_date: string; };

export type DashboardDTO = {
  student: Student;
  courses: Course[];
  enrollments: Enrollment[];
  assignments: Assignment[];
  grades: Grade[];
  attendance: Attendance[];
  financeSummary: { balance_due: number; total_amount: number; next_due_date: string; };
  metrics: {
    overall_progress_pct: number; gpa: number; attendance_pct: number; alerts_unread: number;
  };
  deadlines: { course_code: string; label: string; due_date: string; status: "ok"|"due_soon"|"overdue"; }[];
  recommendations: string[];
};
