import type { DashboardDTO } from "../types/dashboard";

export const login = {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTMzAwMiIsImV4cCI6MTc2MzM5ODMzNn0.Ztw7_cb75FfIp67dThoQqGgwTKjtD5AQtgWHemXQ0R4",
    "token_type": "bearer",
    "student": {
        "s_id": "S3002",
        "name": "Sakshi Nair",
        "email": "sakshi.nair2@hsu.edu",
        "gender": "Female",
        "dob": "2005-01-04",
        "st_phno": "314-555-0030",
        "emergency_contact": "314-555-0530",
        "program": "BA",
        "age": 17,
        "status": "On Probation",
        "level": "Undergrad",
        "admit_term": "Spring 2023",
        }
}
export const demoDashboard: DashboardDTO = {
    "student": {
        "s_id": "S3002",
        "name": "Sakshi Nair",
        "mail_id": "sakshi.nair2@hsu.edu",
        "gender": "F",
        "dob": "2005-01-04",
        "student_phone": "314-555-0030",
        "emergency_contact": "314-555-0530",
        "program": "BA",
        "age": 17,
        "status": "On Probation",
        "level": "Undergrad",
        "admit_term": "Spring 2023"
    },
    "courses": [
        {
            "c_id": "C101",
            "c_title": "Intro to Programming",
            "c_code": "",
            "credits": 4,
            "instructor_name": "Dr. S. Rao"
        },
        {
            "c_id": "C102",
            "c_title": "Data Structures",
            "c_code": "",
            "credits": 4,
            "instructor_name": "Dr. L. Menon"
        },
        {
            "c_id": "C103",
            "c_title": "Database Systems",
            "c_code": "",
            "credits": 3,
            "instructor_name": "Dr. R. Iyer"
        },
        {
            "c_id": "C104",
            "c_title": "Statistics",
            "c_code": "",
            "credits": 3,
            "instructor_name": "Dr. P. Singh"
        },
        {
            "c_id": "C105",
            "c_title": "Web Development",
            "c_code": "",
            "credits": 3,
            "instructor_name": "Dr. A. Kapoor"
        }
    ],
    "enrollments": [
        {
            "e_id": "E_S3002_C101_Spring 2024",
            "s_id": "S3002",
            "c_id": "C101",
            "term": "Spring 2024",
            "registration_status": "Registered",
            "overall_hours": 51,
            "gpa": 2.13
        },
        {
            "e_id": "E_S3002_C102_Spring 2024",
            "s_id": "S3002",
            "c_id": "C102",
            "term": "Spring 2024",
            "registration_status": "Registered",
            "overall_hours": 33,
            "gpa": 2.13
        },
        {
            "e_id": "E_S3002_C103_Fall 2024",
            "s_id": "S3002",
            "c_id": "C103",
            "term": "Fall 2024",
            "registration_status": "Registered",
            "overall_hours": 34,
            "gpa": 2.13
        },
        {
            "e_id": "E_S3002_C104_Spring 2024",
            "s_id": "S3002",
            "c_id": "C104",
            "term": "Spring 2024",
            "registration_status": "Registered",
            "overall_hours": 69,
            "gpa": 2.13
        },
        {
            "e_id": "E_S3002_C105_Spring 2024",
            "s_id": "S3002",
            "c_id": "C105",
            "term": "Spring 2024",
            "registration_status": "Registered",
            "overall_hours": 83,
            "gpa": 2.13
        }
    ],
    "assignments": [
        {
            "a_id": "A1",
            "c_id": "C101",
            "a_name": "Assignment 1",
            "due": "2024-10-01",
            "max_score": 100
        },
        {
            "a_id": "A2",
            "c_id": "C101",
            "a_name": "Assignment 2",
            "due": "2024-10-17",
            "max_score": 100
        },
        {
            "a_id": "A3",
            "c_id": "C101",
            "a_name": "Assignment 3",
            "due": "2024-11-29",
            "max_score": 100
        },
        {
            "a_id": "A4",
            "c_id": "C102",
            "a_name": "Assignment 1",
            "due": "2024-02-12",
            "max_score": 100
        },
        {
            "a_id": "A5",
            "c_id": "C102",
            "a_name": "Assignment 2",
            "due": "2024-01-20",
            "max_score": 100
        },
        {
            "a_id": "A6",
            "c_id": "C102",
            "a_name": "Assignment 3",
            "due": "2024-03-11",
            "max_score": 100
        },
        {
            "a_id": "A7",
            "c_id": "C103",
            "a_name": "Assignment 1",
            "due": "2024-11-22",
            "max_score": 100
        },
        {
            "a_id": "A8",
            "c_id": "C103",
            "a_name": "Assignment 2",
            "due": "2024-08-28",
            "max_score": 100
        },
        {
            "a_id": "A9",
            "c_id": "C103",
            "a_name": "Assignment 3",
            "due": "2024-11-09",
            "max_score": 100
        },
        {
            "a_id": "A10",
            "c_id": "C104",
            "a_name": "Assignment 1",
            "due": "2024-11-02",
            "max_score": 100
        },
        {
            "a_id": "A11",
            "c_id": "C104",
            "a_name": "Assignment 2",
            "due": "2024-12-09",
            "max_score": 100
        },
        {
            "a_id": "A12",
            "c_id": "C104",
            "a_name": "Assignment 3",
            "due": "2024-08-28",
            "max_score": 100
        },
        {
            "a_id": "A13",
            "c_id": "C105",
            "a_name": "Assignment 1",
            "due": "2024-04-17",
            "max_score": 100
        },
        {
            "a_id": "A14",
            "c_id": "C105",
            "a_name": "Assignment 2",
            "due": "2024-02-13",
            "max_score": 100
        },
        {
            "a_id": "A15",
            "c_id": "C105",
            "a_name": "Assignment 3",
            "due": "2024-02-04",
            "max_score": 100
        }
    ],
    "grades": [
        {
            "g_id": "G_S3002_A1_30",
            "s_id": "S3002",
            "a_id": "A1",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 0
        },
        {
            "g_id": "G_S3002_A2_31",
            "s_id": "S3002",
            "a_id": "A2",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 91
        },
        {
            "g_id": "G_S3002_A3_32",
            "s_id": "S3002",
            "a_id": "A3",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 70
        },
        {
            "g_id": "G_S3002_A4_33",
            "s_id": "S3002",
            "a_id": "A4",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 48
        },
        {
            "g_id": "G_S3002_A5_34",
            "s_id": "S3002",
            "a_id": "A5",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 0
        },
        {
            "g_id": "G_S3002_A6_35",
            "s_id": "S3002",
            "a_id": "A6",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 86
        },
        {
            "g_id": "G_S3002_A7_36",
            "s_id": "S3002",
            "a_id": "A7",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 65
        },
        {
            "g_id": "G_S3002_A8_37",
            "s_id": "S3002",
            "a_id": "A8",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 72
        },
        {
            "g_id": "G_S3002_A9_38",
            "s_id": "S3002",
            "a_id": "A9",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 78
        },
        {
            "g_id": "G_S3002_A10_39",
            "s_id": "S3002",
            "a_id": "A10",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 83
        },
        {
            "g_id": "G_S3002_A11_40",
            "s_id": "S3002",
            "a_id": "A11",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 79
        },
        {
            "g_id": "G_S3002_A12_41",
            "s_id": "S3002",
            "a_id": "A12",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 91
        },
        {
            "g_id": "G_S3002_A13_42",
            "s_id": "S3002",
            "a_id": "A13",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 90
        },
        {
            "g_id": "G_S3002_A14_43",
            "s_id": "S3002",
            "a_id": "A14",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 61
        },
        {
            "g_id": "G_S3002_A15_44",
            "s_id": "S3002",
            "a_id": "A15",
            "submitted_date": "None",
            "status": "On Probation",
            "score": 49
        }
    ],
    "attendance": [
        {
            "record_id": "R11",
            "s_id": "S3002",
            "c_id": "C101",
            "attendance_pct": 83
        },
        {
            "record_id": "R12",
            "s_id": "S3002",
            "c_id": "C102",
            "attendance_pct": 91
        },
        {
            "record_id": "R13",
            "s_id": "S3002",
            "c_id": "C103",
            "attendance_pct": 95
        },
        {
            "record_id": "R14",
            "s_id": "S3002",
            "c_id": "C104",
            "attendance_pct": 94
        },
        {
            "record_id": "R15",
            "s_id": "S3002",
            "c_id": "C105",
            "attendance_pct": 79
        }
    ],
    "financeSummary": {
        "balance_due": 0.0,
        "total_amount": 50000.0,
        "next_due_date": "2024-01-08"
    },
    "metrics": {
        "overall_progress_pct": 0.0,
        "gpa": 2.13,
        "attendance_pct": 0.884,
        "alerts_unread": 0
    },
    "recommendations": []
};
