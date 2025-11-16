from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict
from auth import verify_password, create_access_token
from fastapi.middleware.cors import CORSMiddleware
from models import DashboardDTO
from seed import DEMO
import db
from typing import Any
import os


app = FastAPI(title="HSU Student Portal API")

# Allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # create asyncpg pool and store on app.state
    try:
        app.state.db = await db.create_pool()
    except Exception:
        # ignore — keep demo fallback behavior
        app.state.db = None


@app.on_event("shutdown")
async def shutdown():
    pool = getattr(app.state, "db", None)
    if pool:
        await pool.close()


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate a student by s_id (used as username) and password.
    Returns an access token when successful.
    """
    username = form_data.username
    password = form_data.password
    pool = getattr(app.state, "db", None)
    # If DB is available, attempt to find student and verify password_hash
    if pool:
        try:
            row = await db.fetch_one(pool, "SELECT * FROM student WHERE s_id=$1", username)
            if row:
                r = dict(row)
                ph = r.get("password_hash")
                if ph and verify_password(password, ph):
                    token = create_access_token(subject=username)
                    return {"access_token": token, "token_type": "bearer", "student": r}
                # found user but no matching password
                raise HTTPException(status_code=401, detail="Invalid credentials")
        except HTTPException:
            raise
        except Exception:
            # fall through to demo check
            pass

    # fallback: allow demo user using DEFAULT_PASSWORD env (default 'hsu@1234')
    from seed import DEMO
    default_password = os.getenv("DEFAULT_PASSWORD", "hsu@1234")
    if username == DEMO.student.s_id and password == default_password:
        token = create_access_token(subject=username)
        return {"access_token": token, "token_type": "bearer", "student": DEMO.student.model_dump()}

    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/students/{student_id}")
async def get_student(student_id: str) -> Any:
    pool = getattr(app.state, "db", None)
    if pool:
        try:
            row = await db.fetch_one(pool, "SELECT * FROM student WHERE s_id=$1", student_id)
            if row:
                # map email -> mail_id and st_phno -> student_phone to match DTO
                r = dict(row)
                if "email" in r:
                    r["mail_id"] = r.pop("email")
                if "st_phno" in r:
                    r["student_phone"] = r.pop("st_phno")
                return r
            raise HTTPException(status_code=404, detail="Student not found")
        except Exception:
            # fall through to demo behavior
            pass
    # fallback to demo
    if DEMO.student.s_id == student_id:
        return DEMO.student.model_dump()
    raise HTTPException(status_code=404, detail="Student not found")


@app.get("/courses")
async def get_courses() -> Any:
    pool = getattr(app.state, "db", None)
    if pool:
        try:
            rows = await db.fetch_all(
                pool,
                "SELECT c.*, i.name AS instructor_name FROM course c LEFT JOIN course_instructor ci ON ci.c_id = c.c_id LEFT JOIN instructor i ON i.t_id = ci.t_id"
            )
            # map title/code to c_title/c_code for consistency with DTO naming
            mapped = []
            for r in rows:
                m = dict(r)
                if "title" in m:
                    m["c_title"] = m.pop("title")
                if "code" in m:
                    m["c_code"] = m.pop("code")
                if "instructor_name" in m and m.get("instructor_name") is None:
                    m["instructor_name"] = None
                mapped.append(m)
            return mapped
        except Exception:
            pass
    return [c.model_dump() for c in DEMO.courses]


@app.get("/enrollments/{student_id}")
async def get_enrollments(student_id: str) -> Any:
    pool = getattr(app.state, "db", None)
    if pool:
        try:
            rows = await db.fetch_all(pool, "SELECT * FROM enrollment WHERE s_id=$1", student_id)
            return rows
        except Exception:
            pass
    return [e.model_dump() for e in DEMO.enrollments if e.s_id == student_id]


@app.get("/dashboard/{student_id}", response_model=DashboardDTO)
async def get_dashboard(student_id: str, term: str | None = None):
    """Try to build a dashboard from DB if available; otherwise return demo data."""
    pool = getattr(app.state, "db", None)
    if pool:
        try:
            # Attempt to fetch pieces from the DB. These queries assume tables with
            # the same column names as the Pydantic model fields. If they don't
            # exist yet, this will raise and we'll fall back to DEMO.
            student = await db.fetch_one(pool, "SELECT * FROM student WHERE s_id=$1", student_id)
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")

            # Fetch courses and try to include instructor name (if assigned)
            # Join course -> course_instructor -> instructor to get a name when available
            courses = await db.fetch_all(
                pool,
                "SELECT c.*, i.name AS instructor_name FROM course c LEFT JOIN course_instructor ci ON ci.c_id = c.c_id LEFT JOIN instructor i ON i.t_id = ci.t_id"
            )
            enrollments = await db.fetch_all(pool, "SELECT * FROM enrollment WHERE s_id=$1", student_id)
            assignments = await db.fetch_all(
                pool,
                "SELECT a.* FROM assignment a JOIN enrollment e ON a.c_id = e.c_id WHERE e.s_id=$1",
                student_id,
            )
            grades = await db.fetch_all(
                pool,
                "SELECT g.* FROM grade g WHERE g.s_id=$1",
                student_id,
            )
            attendance = await db.fetch_all(pool, "SELECT * FROM attendance WHERE s_id=$1", student_id)
            finance = await db.fetch_one(pool, "SELECT * FROM finance WHERE s_id=$1", student_id)
            # metrics, deadlines, recommendations are not present in the SQL schema; fall back to demo for those
            deadlines = []
            recommendations = []

            # Map DB column names to the expected DTO field names
            # student: email -> mail_id, st_phno -> student_phone
            student_mapped = dict(student)
            if "email" in student_mapped:
                student_mapped["mail_id"] = student_mapped.pop("email")
            if "st_phno" in student_mapped:
                student_mapped["student_phone"] = student_mapped.pop("st_phno")
            # Normalize gender to 'M' or 'F' expected by DashboardDTO
            if "gender" in student_mapped and isinstance(student_mapped["gender"], str):
                g = student_mapped["gender"].strip().lower()
                if g.startswith("f"):
                    student_mapped["gender"] = "F"
                elif g.startswith("m"):
                    student_mapped["gender"] = "M"
                else:
                    # unknown -> keep as-is but coerce to single-letter if possible
                    student_mapped["gender"] = student_mapped["gender"][0].upper()
            # Ensure dob is a string (Pydantic model expects a string)
            if "dob" in student_mapped and not isinstance(student_mapped["dob"], str):
                try:
                    student_mapped["dob"] = student_mapped["dob"].isoformat()
                except Exception:
                    student_mapped["dob"] = str(student_mapped["dob"])

            # courses: title -> c_title, code -> c_code, include instructor_name if present
            courses_mapped = []
            for c in courses:
                cm = dict(c)
                if "title" in cm:
                    cm["c_title"] = cm.pop("title")
                # ensure c_code is a string; DB may have NULLs
                if "code" in cm:
                    code_val = cm.pop("code")
                    cm["c_code"] = code_val if code_val is not None else ""
                elif "c_code" not in cm:
                    cm["c_code"] = ""
                # instructor_name is optional; if database returned it, keep it
                if "instructor_name" in cm and cm.get("instructor_name") is None:
                    # normalize empty to undefined behavior in client by leaving as None
                    cm["instructor_name"] = None
                courses_mapped.append(cm)

            # assignments: name -> a_name, due_date -> due
            assignments_mapped = []
            for a in assignments:
                am = dict(a)
                if "name" in am:
                    am["a_name"] = am.pop("name")
                if "due_date" in am:
                    dv = am.pop("due_date")
                    try:
                        am["due"] = dv.isoformat() if hasattr(dv, "isoformat") else str(dv)
                    except Exception:
                        am["due"] = str(dv)
                assignments_mapped.append(am)

            # grades: submitted_at -> submitted_date
            grades_mapped = []
            for g in grades:
                gm = dict(g)
                if "submitted_at" in gm:
                    sv = gm.pop("submitted_at")
                    try:
                        gm["submitted_date"] = sv.isoformat() if hasattr(sv, "isoformat") else str(sv)
                    except Exception:
                        gm["submitted_date"] = str(sv)
                grades_mapped.append(gm)

            # finance: total_amt -> total_amount, due_date -> next_due_date
            finance_mapped = None
            if finance:
                fm = dict(finance)
                if "total_amt" in fm:
                    fm["total_amount"] = fm.pop("total_amt")
                if "due_date" in fm:
                    dv = fm.pop("due_date")
                    try:
                        fm["next_due_date"] = dv.isoformat() if hasattr(dv, "isoformat") else str(dv)
                    except Exception:
                        fm["next_due_date"] = str(dv)
                finance_mapped = fm

            # We do not include a separate 'deadlines' field in the dashboard
            # Responses; assignments carry their due dates and the client
            # should use assignment.due to surface calendar items.

            # Compute metrics. Use demo metrics as a base but derive attendance_pct
            # from the attendance rows fetched from the DB. The frontend expects
            # metrics.attendance_pct to be a fraction in the range 0..1.
            metrics = DEMO.metrics.model_dump()
            try:
                total = 0.0
                count = 0
                for r in attendance:
                    # r may be an asyncpg Record or dict-like
                    rec = dict(r) if not isinstance(r, dict) else r
                    ap = rec.get("attendance_pct")
                    if ap is None:
                        continue
                    # if stored as 0..100, convert to 0..1
                    try:
                        v = float(ap)
                    except Exception:
                        continue
                    if v > 1:
                        v = v / 100.0
                    total += v
                    count += 1
                metrics["attendance_pct"] = (total / count) if count > 0 else 0.0
            except Exception:
                # fallback to demo metric if anything goes wrong
                metrics = DEMO.metrics.model_dump()
            # Compute GPA as average of per-enrollment gpa values (if present)
            try:
                g_total = 0.0
                g_count = 0
                for e in enrollments:
                    rec = dict(e) if not isinstance(e, dict) else e
                    gp = rec.get("gpa")
                    if gp is None:
                        continue
                    try:
                        gv = float(gp)
                    except Exception:
                        continue
                    g_total += gv
                    g_count += 1
                metrics["gpa"] = (g_total / g_count) if g_count > 0 else metrics.get("gpa", 0.0)
            except Exception:
                # leave metrics.gpa as-is (demo value) on error
                pass

            # Assemble into the expected DTO shape. We trust the DB columns roughly
            # match the Pydantic names; otherwise FastAPI will validate/raise.
            payload = {
                "student": student_mapped,
                "courses": courses_mapped,
                "enrollments": enrollments,
                "assignments": assignments_mapped,
                "grades": grades_mapped,
                "attendance": attendance,
                "financeSummary": finance_mapped or DEMO.financeSummary.model_dump(),
                "metrics": metrics,
                # no 'deadlines' field
                "recommendations": recommendations or DEMO.recommendations,
            }
            return payload
        except HTTPException:
            raise
        except Exception as e:
            # If anything goes wrong (missing tables, parse issues), fall back
            # to demo data.
            print(e.__str__())
            print("Falling back to demo data due to DB error")
            pass
    # fallback while DB is not ready — do not return demo data automatically
    # Surface a service-unavailable error so clients don't receive seeded demo entries
    raise HTTPException(status_code=503, detail="Service unavailable")
