from fastapi import FastAPI
from services.treatment_services import get_treatment_data
import requests
import os

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL")


@app.get("/")
def root():
    return {"status": "Backend running 🚀"}


@app.get("/treatment/{name}")
def get_treatment(name: str):

    print("BACKEND HIT:", name)

    result = get_treatment_data(name)

    return result


