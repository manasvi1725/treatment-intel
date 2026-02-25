import requests
from db.mongo import treatments_collection
import os
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL") #"http://localhost:8000/run-pipeline"


def get_treatment_data(treatment: str):

    treatment = treatment.lower()

    # 1️⃣ Check MongoDB
    existing = treatments_collection.find_one(
        {"treatment": treatment}
    )

    if existing:
        return {
            "source": "database",
            "data": existing["data"]
        }

    # 2️⃣ Call ML service
    response = requests.get(
        f"{ML_SERVICE_URL}/{treatment}"
    )

    result = response.json()

    # If using wrapped format
    if "success" in result and not result["success"]:
        raise Exception(result["error"])

    pipeline_data = (
        result["data"]
        if "data" in result
        else result
    )

    # 3️⃣ Store in MongoDB
    treatments_collection.insert_one({
        "treatment": treatment,
        "data": pipeline_data
    })

    return {
        "source": "pipeline",
        "data": pipeline_data
    }