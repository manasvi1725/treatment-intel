from fastapi import FastAPI
from services.treatment_services import get_treatment_data

app = FastAPI()


@app.get("/")
def root():
    return {"status": "Backend running 🚀"}


@app.get("/treatment/{name}")
def get_treatment(name: str):

    result = get_treatment_data(name)

    return result