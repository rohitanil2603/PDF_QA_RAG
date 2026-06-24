from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import os
import subprocess

from rag import ask_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "Backend running"
    }


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    os.makedirs("data", exist_ok=True)

    file_path = "data/current.pdf"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    subprocess.run(["python", "ingest.py"])

    return {
        "message": "PDF uploaded and indexed"
    }

@app.post("/ask")
def ask(data: QuestionRequest):

    answer = ask_question(
        data.question
    )

    return {
        "question": data.question,
        "answer": answer
    }