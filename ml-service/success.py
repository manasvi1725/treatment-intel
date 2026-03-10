from collections import Counter

# -----------------------------
# Success / Positive Outcomes
# -----------------------------
success_keywords = [

    # Survival / remission
    "survival rate", "higher survival", "long term survival",
    "remission", "complete remission", "partial remission",
    "disease free", "disease-free survival",

    # Treatment effectiveness
    "effective treatment", "treatment effective",
    "treatment worked", "responded well",
    "positive response", "good response",
    "tumor reduction", "tumour reduction",
    "tumor shrinkage", "tumour shrinkage",
    "cancer shrinking", "lesion reduction",

    # Recovery indicators
    "recovery successful", "successful recovery",
    "patient recovered", "health improved",
    "symptoms improved", "significant improvement",

    # Clinical outcome terms
    "improved outcome", "better prognosis",
    "treatment benefit", "clinical benefit",
    "progression free survival"
]


# -----------------------------
# Failure / Negative Outcomes
# -----------------------------
failure_keywords = [

    "treatment failed", "therapy failed",
    "no response to treatment",
    "poor response", "minimal response",

    "disease progression", "tumor progression",
    "tumour progression", "cancer progression",

    "relapse", "disease recurrence",
    "tumor growth", "tumour growth",

    "ineffective treatment",
    "treatment ineffective",
    "treatment stopped working",

    "condition worsened",
    "no improvement",
    "complications worsened"
]


# -----------------------------
# Success Builder
# -----------------------------
def build_success_block(corpus):

    success_count = 0
    failure_count = 0

    for doc in corpus:

        text = doc["text"].lower()

        for word in success_keywords:
            if word in text:
                success_count += 1

        for word in failure_keywords:
            if word in text:
                failure_count += 1

    total = success_count + failure_count

    if total == 0:
        success_rate = 50
    else:
        success_rate = int((success_count / total) * 100)

    return {
        "success_rate": success_rate
    }