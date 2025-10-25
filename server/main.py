from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import DashboardDTO
from seed import DEMO

app = FastAPI(title="HSU Student Portal API")

# Allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/dashboard/{student_id}", response_model=DashboardDTO)
def get_dashboard(student_id: str, term: str | None = None):
    # In a real app: fetch + join from SIS/LMS/Finance by student_id & term
    if student_id != "S001":
        raise HTTPException(status_code=404, detail="Student not found")
    return DEMO
