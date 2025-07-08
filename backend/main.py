from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel, EmailStr, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from threading import Lock
import requests




# Create a FastAPI app instance
app = FastAPI(title="FealtyX Student API")

# ✅ Add CORS middleware AFTER app is created
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Model representing a student (used for storing and returning data)
class Student(BaseModel):
    id: int
    name: str = Field(..., min_length=3)
    age: int = Field(..., gt=0)
    email: EmailStr

# Model used when creating a new student (no ID needed)
class StudentCreate(BaseModel):
    name: str = Field(..., min_length=3)
    age: int = Field(..., gt=0)
    email: EmailStr

# Dictionary to store students in memory
students: Dict[int, Student] = {}

# Auto-incrementing ID counter
idCounter = 1

# Lock to make data access thread-safe
lock = Lock()

# Create and add a new student
@app.post("/students", response_model=Student, status_code=201)
def create_student(student: StudentCreate):
    global idCounter
    with lock:
        s = Student(id=idCounter, **student.dict())
        students[idCounter] = s
        idCounter += 1
        return s

# Get a list of all students
@app.get("/students", response_model=list[Student])
def get_students():
    with lock:
        return list(students.values())

# Get a student by their ID
@app.get("/students/{id}", response_model=Student)
def get_student(id: int = Path(..., gt=0)):
    print(id)
    with lock:
        if id not in students:
            raise HTTPException(status_code=404, detail="Student not found")
        print(students[id],type(students[id]))
        return students[id]

# Update an existing student's info
@app.put("/students/{id}", response_model=Student)
def update_student(id: int, student: StudentCreate):
    with lock:
        if id not in students:
            raise HTTPException(status_code=404, detail="Student not found")
        updated = Student(id=id, **student.dict())
        students[id] = updated
        return updated

# Remove a student by ID
@app.delete("/students/{id}", status_code=204)
def delete_student(id: int):
    with lock:
        if id not in students:
            raise HTTPException(status_code=404, detail="Student not found")
        del students[id]
        return

# Get a short AI-generated summary for a student
@app.get("/students/{id}/summary")
def get_student_summary(id: int):
    with lock:
        if id not in students:
            raise HTTPException(status_code=404, detail="Student not found")
        student = students[id]

    # Prompt to send to the LLM model
    prompt = f"""
Write a short  one-sentence summary about the student using ONLY the following details. 
Do not request additional information. Do not say it's insufficient. Just generate a simple summary.

Name: {student.name}
Age: {student.age}
Email: {student.email}
"""

    try:        # Send request to local Ollama server
        response = requests.post(
            "http://localhost:11434/api/generate/",
            json={"model": "llama3.2:latest", "prompt": prompt, "stream": False},
        )
        response.raise_for_status()
        return response.json()["response"]
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Ollama error: {e}")
