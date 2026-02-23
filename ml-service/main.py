from fastapi import FastAPI
from pipeline.master_pipeline import run_full_pipeline

app = FastAPI()


@app.get("/")
def root():
    return {"message": "ML Service Running 🚀"}


@app.get("/run-pipeline/{treatment}")
def run_pipeline(treatment: str):

    try:
        result = run_full_pipeline(treatment)
        return result

    except Exception as e:
        return {
            "error": str(e),
            "treatment": treatment
        }