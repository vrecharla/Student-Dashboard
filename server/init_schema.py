# init_schema.py
import asyncio
import asyncpg
import os

DB_DSN = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/student")  # postgresql://user:pass@localhost:5432/dbname

SCHEMA_SQL = """
-- STUDENT
CREATE TABLE IF NOT EXISTS student (
  s_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  gender TEXT,
  dob DATE,
  st_phno TEXT,
  emergency_contact TEXT,
  program TEXT,
  age INT,
  status TEXT,
  level TEXT,
  admit_term TEXT,
  password_hash TEXT
);

-- COURSE
CREATE TABLE IF NOT EXISTS course (
  c_id TEXT PRIMARY KEY,
  title TEXT,
  code TEXT,
  credits INT
);

-- INSTRUCTOR
CREATE TABLE IF NOT EXISTS instructor (
  t_id TEXT PRIMARY KEY,
  name TEXT,
  designation TEXT,
  email TEXT
);

-- COURSE_INSTRUCTOR
CREATE TABLE IF NOT EXISTS course_instructor (
  ci_id TEXT PRIMARY KEY,
  c_id TEXT NOT NULL REFERENCES course(c_id) ON DELETE CASCADE,
  t_id TEXT NOT NULL REFERENCES instructor(t_id) ON DELETE CASCADE
);

-- ASSIGNMENT
CREATE TABLE IF NOT EXISTS assignment (
  a_id TEXT PRIMARY KEY,
  c_id TEXT NOT NULL REFERENCES course(c_id) ON DELETE CASCADE,
  name TEXT,
  due_date DATE,
  max_score INT
);

-- ENROLLMENT
CREATE TABLE IF NOT EXISTS enrollment (
  e_id TEXT PRIMARY KEY,
  s_id TEXT NOT NULL REFERENCES student(s_id) ON DELETE CASCADE,
  c_id TEXT NOT NULL REFERENCES course(c_id) ON DELETE CASCADE,
  term TEXT,
  registration_status TEXT,
  overall_hours NUMERIC,
  gpa NUMERIC
);

-- GRADE
CREATE TABLE IF NOT EXISTS grade (
  g_id TEXT PRIMARY KEY,
  s_id TEXT NOT NULL REFERENCES student(s_id) ON DELETE CASCADE,
  a_id TEXT NOT NULL REFERENCES assignment(a_id) ON DELETE CASCADE,
  submitted_at TIMESTAMP,
  status TEXT,
  score INT
);

-- ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
  record_id TEXT PRIMARY KEY,
  s_id TEXT NOT NULL REFERENCES student(s_id) ON DELETE CASCADE,
  c_id TEXT NOT NULL REFERENCES course(c_id) ON DELETE CASCADE,
  attendance_pct INT
);

-- FINANCE
CREATE TABLE IF NOT EXISTS finance (
  f_id TEXT PRIMARY KEY,
  s_id TEXT NOT NULL REFERENCES student(s_id) ON DELETE CASCADE,
  balance_due NUMERIC,
  total_amt NUMERIC,
  due_date DATE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollment_sid ON enrollment(s_id);
CREATE INDEX IF NOT EXISTS idx_assignment_cid ON assignment(c_id);
CREATE INDEX IF NOT EXISTS idx_grade_sid ON grade(s_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sid ON attendance(s_id);
"""

async def init_schema():
    print("Connecting to database...")
    conn = await asyncpg.connect(DB_DSN)

    try:
        async with conn.transaction():
            print("Applying schema...")
            await conn.execute(SCHEMA_SQL)

        print("Schema created successfully!")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(init_schema())
