import requests
from db.mongo import treatments_collection
import os

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL")


def get_treatment_data(treatment: str):

    treatment = treatment.lower()

    existing = treatments_collection.find_one(
        {"treatment": treatment}
    )

    # ✅ If ready
    if existing and existing.get("status") == "ready":
        return {
            "status": "ready",
            "data": existing["data"]
        }

    # ✅ If already processing
    if existing and existing.get("status") == "processing":
        return {"status": "processing"}

    # 🔥 Not found → mark processing + trigger ML
    treatments_collection.insert_one({
        "treatment": treatment,
        "status": "processing"
    })

    requests.post(
        f"{ML_SERVICE_URL}/run-pipeline/{treatment}"
    )

    return {"status": "processing"}