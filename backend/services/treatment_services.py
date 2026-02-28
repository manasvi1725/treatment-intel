import requests
from db.mongo import treatments_collection
import os

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL")


def get_treatment_data(treatment: str):

    treatment = treatment.lower().strip()

    existing = treatments_collection.find_one(
        {"treatment": treatment}
    )

    # ✅ If ready → return data
    if existing and existing.get("status") == "ready":
        return {
            "status": "ready",
            "data": existing["data"]
        }

    # ✅ If already processing → just tell frontend
    if existing and existing.get("status") == "processing":
        return {"status": "processing"}

    # 🔥 Not found → mark processing safely (NO insert_one)
    treatments_collection.update_one(
        {"treatment": treatment},
        {
            "$set": {
                "treatment": treatment,
                "status": "processing"
            }
        },
        upsert=True
    )

    # 🔥 Trigger ML
    requests.post(
        f"{ML_SERVICE_URL}/run-pipeline/{treatment}"
    )

    return {"status": "processing"}