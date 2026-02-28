print("ML DIRECTLY HIT")

from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from db.mongo import treatments_collection

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


@app.post("/run-pipeline/{treatment}")
def run_pipeline(treatment: str, background_tasks: BackgroundTasks):

    # Start background job
    background_tasks.add_task(process_pipeline, treatment)

    return {"status": "processing"}


def process_pipeline(treatment: str):

    try:
        from pipeline.master_pipeline import run_full_pipeline

        print(f"Starting pipeline for {treatment}")

        result = run_full_pipeline(treatment)

        treatments_collection.update_one(
            {"treatment": treatment},
            {
                "$set": {
                    "data": result,
                    "status": "ready"
                }
            }
        )

        print(f"Saved {treatment} to Mongo")

    except Exception as e:
        print(f"Pipeline failed for {treatment}: {str(e)}")