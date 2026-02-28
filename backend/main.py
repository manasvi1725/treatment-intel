from fastapi import FastAPI
from services.treatment_services import get_treatment_data
import requests
import os

app = FastAPI()

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL")


@app.get("/")
def root():
    return {"status": "Backend running 🚀"}


@app.get("/treatment/{name}")
def get_treatment(name: str):

    print("BACKEND HIT:", name)

    result = get_treatment_data(name)

    return result


