print("ML DIRECTLY HIT")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ML Service Running 🚀"}


@app.get("/run-pipeline/{treatment}")
def run_pipeline(treatment: str):

    try:
        # Lazy import prevents startup blocking
        from pipeline.master_pipeline import run_full_pipeline

        result = run_full_pipeline(treatment)

        return result

    except Exception as e:
        return {
            "error": str(e),
            "treatment": treatment
        }