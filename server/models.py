from pydantic import BaseModel
from typing import List, Literal, Optional

class Student(BaseModel):
    s_id: str
    name: str
    mail_id: str
    gender: Literal["M","F"]
    dob: str
    student_phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    program: str
    age: int
    status: str
    level: str
    admit_term: str

class Course(BaseModel):
    c_id: str
    c_title: str
    c_code: str
    credits: int
    instructor_name: Optional[str] = None

class Enrollment(BaseModel):
    e_id: str
    s_id: str
    c_id: str
    term: str
    registration_status: str
    overall_hours: Optional[int] = None
    gpa: Optional[float] = None

class Assignment(BaseModel):
    a_id: str
    c_id: str
    a_name: str
    due: str
    max_score: int

class Grade(BaseModel):
    g_id: str
    s_id: str
    a_id: str
    submitted_date: str
    status: str
    score: int

class Attendance(BaseModel):
    record_id: str
    s_id: str
    c_id: str
    week: Optional[int] = None
    attendance_pct: int

class FinanceSummary(BaseModel):
    balance_due: float
    total_amount: float
    next_due_date: str

class Metrics(BaseModel):
    overall_progress_pct: float
    gpa: float
    attendance_pct: float
    alerts_unread: int
class DashboardDTO(BaseModel):
    student: Student
    courses: List[Course]
    enrollments: List[Enrollment]
    assignments: List[Assignment]
    grades: List[Grade]
    attendance: List[Attendance]
    financeSummary: FinanceSummary
    metrics: Metrics
    recommendations: List[str]
