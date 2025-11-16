# load_xlsx_to_pg.py
import os
import asyncio
import asyncpg
import pandas as pd
from datetime import datetime, date
# load_xlsx_to_pg.py
import os
import asyncio
import asyncpg
import pandas as pd
from datetime import datetime, date
from auth import get_password_hash

DB_DSN = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/student")
XLSX_PATH = os.getenv("XLSX_PATH", "Group 10 Synthetic Datset.xlsx")

# ---------------------------------------
# Helpers
# ---------------------------------------

def clean_col(c):
    return c.strip()

def to_date(val):
    """Convert XLSX date string → python.date"""
    if val is None or pd.isna(val):
        return None

    if isinstance(val, date):
        return val

    if isinstance(val, datetime):
        return val.date()

    s = str(val).strip()
    if not s:
        return None

    try:
        dt = pd.to_datetime(s, errors="raise")
        return dt.date()
    except:
        return None

def to_timestamp(val):
    """Convert XLSX string → python.datetime"""
    if val is None or pd.isna(val):
        return None

    if isinstance(val, datetime):
        return val

    if isinstance(val, pd.Timestamp):
        return val.to_pydatetime()

    s = str(val).strip()
    if not s:
        return None

    try:
        dt = pd.to_datetime(s, errors="raise")
        return dt.to_pydatetime()
    except:
        return None


def get_val(row, names):
    """Return the first non-null value in row for any of the candidate column names."""
    for n in names:
        if n in row.index:
            v = row.get(n)
            if not (v is None or (isinstance(v, float) and pd.isna(v))):
                return v
    return None


async def upsert_many(conn, query, args_list):
    async with conn.transaction():
        for args in args_list:
            await conn.execute(query, *args)


# ---------------------------------------
# MAIN
# ---------------------------------------

async def main():
    print("Loading XLSX:", XLSX_PATH)
    # Read all sheets so we can find entities regardless of which sheet they live in
    sheets = pd.read_excel(XLSX_PATH, sheet_name=None)
    print("Found sheets:", list(sheets.keys()))

    # Normalize column names per-sheet and collect diagnostics
    norm_sheets = {}
    for name, sdf in sheets.items():
        sdf.columns = [clean_col(c) for c in sdf.columns]
        norm_sheets[name] = sdf

    # Print quick diagnostics per sheet to help find where assignments/attendance live
    for name, sdf in norm_sheets.items():
        total = len(sdf)
        has_aid = sdf.apply(lambda r: get_val(r, ["a_id", "assignment_id", "aid", "assignment_name"]) is not None, axis=1).sum()
        has_att = sdf.apply(lambda r: get_val(r, ["s_id", "student_id"]) is not None and get_val(r, ["c_id", "course_id", "cid"]) is not None, axis=1).sum()
        has_grade = sdf.apply(lambda r: get_val(r, ["g_id", "grade_id"]) is not None and get_val(r, ["a_id", "a_id"]) is not None, axis=1).sum()
        print(f"Sheet '{name}': rows={total}, rows_with_assignment_like={has_aid}, rows_with_attendance_like={has_att}, rows_with_grade_like={has_grade}")

    # Combine sheets into single dataframe for legacy logic (ON CONFLICT upserts prevent duplicates)
    df = pd.concat(list(norm_sheets.values()), ignore_index=True, sort=False)

    # ---------------- STUDENTS ----------------
    students = []
    seen_s = set()

    # Default password (environment override possible)
    default_password = os.getenv("DEFAULT_PASSWORD", "hsu@1234")
    default_pw_hash = get_password_hash(default_password)

    for _, row in df.iterrows():
        s_id = row.get("s_id")
        if pd.isna(s_id):
            continue
        sid = str(s_id)
        if sid in seen_s:
            continue
        seen_s.add(sid)

        students.append((
            sid,
            row.get("name") or None,
            row.get("email") or None,
            row.get("gender") or None,
            to_date(row.get("dob")),
            row.get("student_phone") if "student_phone" in df.columns else None,
            row.get("emergency_phone") if "emergency_phone" in df.columns else None,
            row.get("program") or None,
            int(row.get("age")) if "age" in df.columns and not pd.isna(row.get("age")) else None,
            row.get("status") or None,
            row.get("level") or None,
            row.get("admit_term") or None,
            default_pw_hash,
        ))

    # ---------------- COURSES ----------------
    courses = []
    seen_c = set()

    for _, row in df.iterrows():
        cid = row.get("c_id")
        if pd.isna(cid):
            continue

        cid = str(cid)
        if cid in seen_c:
            continue
        seen_c.add(cid)

        courses.append((
            cid,
            row.get("title") or None,
            row.get("code") or None,
            int(row.get("credits")) if "credits" in df.columns and not pd.isna(row.get("credits")) else None,
        ))

    # ---------------- ASSIGNMENTS ----------------
    seen_assignments = set()  # Track (assignment_name, c_id) tuples
    assignments = []
    next_aid = 1  # Counter for generated assignment IDs

    for _, row in df.iterrows():
        name = row["assignment_name"]
        cid = row["c_id"]
        due_raw = row["due_date"]
        max_raw = row["max_score"]

        # Skip if name or course_id is missing
        if pd.isna(name) or pd.isna(cid):
            continue

        # Deduplication key
        dedup_key = (name, str(cid))
        if dedup_key in seen_assignments:
            continue
        seen_assignments.add(dedup_key)

        # Generate new assignment ID like A1, A2, ...
        aid = f"A{next_aid}"
        next_aid += 1

        assignments.append((
            aid,
            str(cid),
            name,
            to_date(due_raw),
            int(max_raw) if not pd.isna(max_raw) else None,
        ))

    # ---------------- ENROLLMENTS ----------------
    enrollments = []
    seen_en = set()

    for _, row in df.iterrows():
        s_id = row.get("s_id")
        c_id = row.get("c_id")
        term = row.get("term")

        if pd.isna(s_id) or pd.isna(c_id):
            continue

        key = (str(s_id), str(c_id), str(term) if not pd.isna(term) else "")
        if key in seen_en:
            continue
        seen_en.add(key)

        e_id = f"E_{s_id}_{c_id}_{term}"

        enrollments.append((
            e_id,
            str(s_id),
            str(c_id),
            row.get("term") or None,
            row.get("registration_status") or None,
            float(row.get("overall_hours")) if "overall_hours" in df.columns and not pd.isna(row.get("overall_hours")) else None,
            float(row.get("Term_GPA")) if "Term_GPA" in df.columns and not pd.isna(row.get("Term_GPA")) else (float(row.get("gpa")) if "gpa" in df.columns and not pd.isna(row.get("gpa")) else None)
        ))

    # ---------------- GRADES ----------------
    # Build a lookup dictionary from assignments: (name, c_id) -> a_id
    assignment_lookup = {(name, str(cid)): aid for aid, cid, name, _, _ in assignments}

    grades = []

    for idx, row in df.iterrows():
        s_id = row.get("s_id")
        name = row.get("assignment_name")
        cid = row.get("c_id")

        # Skip if student_id, assignment_name, or course_id is missing
        if pd.isna(s_id) or pd.isna(name) or pd.isna(cid):
            continue

        # Lookup a_id from assignment list
        a_id = assignment_lookup.get((name, str(cid)))
        if a_id is None:
            continue  # Skip if assignment is not found

        # Generate unique grade ID if g_id is missing
        g_id = (
            row.get("g_id")
            if "g_id" in df.columns and not pd.isna(row.get("g_id"))
            else f"G_{s_id}_{a_id}_{idx}"
        )

        # Append cleaned tuple
        grades.append((
            str(g_id),
            str(s_id),
            str(a_id),
            to_timestamp(row.get("submitted") if "submitted" in df.columns else row.get("submitted_date")),
            row.get("status") or None,
            int(row.get("score")) if "score" in df.columns and not pd.isna(row.get("score")) else None
        ))


    # ---------------- ATTENDANCE ----------------
    attendance = []
    seen_att = set()  # Track (s_id, c_id) tuples
    next_rid = 1      # Counter for generated record IDs

    for _, row in df.iterrows():
        s_id = row.get("s_id") or row.get("student_id")
        c_id = row.get("c_id") or row.get("course_id") or row.get("cid")

        # Skip if essential info is missing
        if pd.isna(s_id) or pd.isna(c_id):
            continue

        # Deduplication key based on student and course
        dedup_key = (str(s_id), str(c_id))
        if dedup_key in seen_att:
            continue
        seen_att.add(dedup_key)

        # Generate unique record ID like R1, R2, ...
        rec_id = f"R{next_rid}"
        next_rid += 1

        # Attendance percentage
        att_pct = row.get("attendance_pct") or row.get("attendance %") or row.get("attendance")

        attendance.append((
            rec_id,
            str(s_id),
            str(c_id),
            int(att_pct) if att_pct is not None and not pd.isna(att_pct) else None
        ))


    # ---------------- FINANCE ----------------
    finances = []
    seen_f = set()

    for _, row in df.iterrows():
        s_id = row.get("s_id")
        if pd.isna(s_id):
            continue

        s_id = str(s_id)
        if s_id in seen_f:
            continue
        seen_f.add(s_id)

        f_id = (
            row.get("f_id")
            if "f_id" in df.columns and not pd.isna(row.get("f_id"))
            else f"F_{s_id}"
        )

        finances.append((
            str(f_id),
            s_id,
            float(row.get("balance_due")) if "balance_due" in df.columns and not pd.isna(row.get("balance_due")) else None,
            float(row.get("total_amount")) if "total_amount" in df.columns and not pd.isna(row.get("total_amount")) else (float(row.get("total_amt")) if "total_amt" in df.columns and not pd.isna(row.get("total_amt")) else None),
            to_date(row.get("finance_due_date") if "finance_due_date" in df.columns else row.get("due_date"))
        ))

    
    # ---------------- INSTRUCTORS ----------------
    instructors = []
    seen_t = set()
    next_tid = 1  # Counter for generated instructor IDs

    for _, row in df.iterrows():
        name = row.get("instructor_name")

        if pd.isna(name):
            continue

        # Deduplicate by name+email
        key = (str(name))
        if key in seen_t:
            continue
        seen_t.add(key)

        tid = f"I{next_tid}"
        next_tid += 1

        instructors.append((
            tid,
            name or None,
            row.get("disgnation") or None,
            row.get("instructor_email") or None,
        ))

    # ---------------- COURSE_INSTRUCTORS ----------------
    course_instructors = []
    seen_ci = set()
    next_ciid = 1  # Counter for generated course_instructor IDs

    # Build a lookup for instructor IDs by name/email
    instructor_lookup = {(name): tid for tid, name, _, _ in instructors}

    for _, row in df.iterrows():
        c_id = row.get("c_id")
        name = row.get("instructor_name")

        if pd.isna(c_id) or (pd.isna(name)):
            continue

        tid = instructor_lookup.get((name))
        if tid is None:
            continue

        key = (str(c_id), tid)
        if key in seen_ci:
            continue
        seen_ci.add(key)

        ciid = f"CI{next_ciid}"
        next_ciid += 1

        course_instructors.append((
            ciid,
            str(c_id),
            tid
        ))


    # ---------------------------------------
    # INSERT INTO POSTGRES
    # ---------------------------------------

    conn = await asyncpg.connect(DB_DSN)

    try:
        print("Inserting data into database...")
        print(f"Prepared {len(students)} students, {len(courses)} courses, {len(assignments)} assignments, {len(enrollments)} enrollments, {len(grades)} grades, {len(attendance)} attendance records, {len(finances)} finance records")
        await upsert_many(conn, """
            INSERT INTO student(s_id, name, email, gender, dob, st_phno, emergency_contact, program, age, status, level, admit_term, password_hash)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            ON CONFLICT (s_id) DO UPDATE SET
              name=EXCLUDED.name,
              email=EXCLUDED.email,
              gender=EXCLUDED.gender,
              dob=EXCLUDED.dob,
              st_phno=EXCLUDED.st_phno,
              emergency_contact=EXCLUDED.emergency_contact,
              program=EXCLUDED.program,
              age=EXCLUDED.age,
              status=EXCLUDED.status,
              level=EXCLUDED.level,
              admit_term=EXCLUDED.admit_term,
              password_hash=EXCLUDED.password_hash;
        """, students)

        await upsert_many(conn, """
            INSERT INTO course(c_id, title, code, credits)
            VALUES($1,$2,$3,$4)
            ON CONFLICT (c_id) DO UPDATE SET
              title=EXCLUDED.title,
              code=EXCLUDED.code,
              credits=EXCLUDED.credits;
        """, courses)

        await upsert_many(conn, """
            INSERT INTO assignment(a_id, c_id, name, due_date, max_score)
            VALUES($1,$2,$3,$4,$5)
            ON CONFLICT (a_id) DO UPDATE SET
              c_id=EXCLUDED.c_id,
              name=EXCLUDED.name,
              due_date=EXCLUDED.due_date,
              max_score=EXCLUDED.max_score;
        """, assignments)

        await upsert_many(conn, """
            INSERT INTO enrollment(e_id, s_id, c_id, term, registration_status, overall_hours, gpa)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (e_id) DO UPDATE SET
              s_id=EXCLUDED.s_id,
              c_id=EXCLUDED.c_id,
              term=EXCLUDED.term,
              registration_status=EXCLUDED.registration_status,
              overall_hours=EXCLUDED.overall_hours,
              gpa=EXCLUDED.gpa;
        """, enrollments)

        await upsert_many(conn, """
            INSERT INTO grade(g_id, s_id, a_id, submitted_at, status, score)
            VALUES($1,$2,$3,$4,$5,$6)
            ON CONFLICT (g_id) DO UPDATE SET
              s_id=EXCLUDED.s_id,
              a_id=EXCLUDED.a_id,
              submitted_at=EXCLUDED.submitted_at,
              status=EXCLUDED.status,
              score=EXCLUDED.score;
        """, grades)

        await upsert_many(conn, """
            INSERT INTO attendance(record_id, s_id, c_id, attendance_pct)
            VALUES($1,$2,$3,$4)
            ON CONFLICT (record_id) DO UPDATE SET
              s_id=EXCLUDED.s_id,
              c_id=EXCLUDED.c_id,
              attendance_pct=EXCLUDED.attendance_pct;
        """, attendance)

        await upsert_many(conn, """
            INSERT INTO finance(f_id, s_id, balance_due, total_amt, due_date)
            VALUES($1,$2,$3,$4,$5)
            ON CONFLICT (f_id) DO UPDATE SET
              s_id=EXCLUDED.s_id,
              balance_due=EXCLUDED.balance_due,
              total_amt=EXCLUDED.total_amt,
              due_date=EXCLUDED.due_date;
        """, finances)

        await upsert_many(conn, """
            INSERT INTO instructor(t_id, name, designation, email)
            VALUES($1,$2,$3,$4)
            ON CONFLICT (t_id) DO UPDATE SET
            name=EXCLUDED.name,
            designation=EXCLUDED.designation,
            email=EXCLUDED.email;
        """, instructors)

        await upsert_many(conn, """
            INSERT INTO course_instructor(ci_id, c_id, t_id)
            VALUES($1,$2,$3)
            ON CONFLICT (ci_id) DO UPDATE SET
            c_id=EXCLUDED.c_id,
            t_id=EXCLUDED.t_id;
        """, course_instructors)


        print("\n🎉 Data load complete!\n")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
