import re


# --------------------------------------------------
# Time Mention Patterns
# --------------------------------------------------
time_patterns = [
    r"\b\d+\s*(?:weeks?|months?|years?)\b",
    r"\b\d+\s*-\s*\d+\s*(?:weeks?|months?|years?)\b",
    r"\bfew\s*(?:weeks?|months?)\b",
    r"\bcouple\s*of\s*(?:weeks?|months?)\b"
]


def extract_time_mentions(text):

    mentions = []

    for pattern in time_patterns:
        matches = re.findall(pattern, text.lower())
        mentions.extend(matches)

    return mentions


# --------------------------------------------------
# Recovery Stage Keywords
# --------------------------------------------------
stage_keywords = {

    "Procedure Phase": [
        "during surgery", "operation day",
        "during treatment", "operation theatre"
    ],

    "Immediate Recovery": [
        "after surgery", "post treatment",
        "first week", "icu stay"
    ],

    "Short-term Recovery": [
        "rehab", "physiotherapy",
        "gaining mobility", "stitches removal"
    ],

    "Long-term Recovery": [
        "fully healed", "back to normal",
        "1 year later", "long term recovery"
    ]
}


def detect_recovery_stages(corpus, keywords):

    stage_counts = {stage: 0 for stage in keywords}

    for doc in corpus:

        text = (
            doc["text"]
            if isinstance(doc, dict)
            else str(doc)
        ).lower()

        for stage, words in keywords.items():
            for word in words:
                if word in text:
                    stage_counts[stage] += 1

    return stage_counts


# --------------------------------------------------
# Completion + Duration Maps
# --------------------------------------------------

stage_duration_map = {
    "Procedure Phase": "1–2 days",
    "Immediate Recovery": "1–3 weeks",
    "Short-term Recovery": "1–3 months",
    "Long-term Recovery": "3–12 months"
}

def compute_completion_scores(stage_counts):

    total = sum(stage_counts.values())

    if total == 0:
        return {
            "Procedure Phase": 20,
            "Immediate Recovery": 40,
            "Short-term Recovery": 60,
            "Long-term Recovery": 80
        }

    completion = {}

    for stage, count in stage_counts.items():
        completion[stage] = int((count / total) * 100)

    return completion
# --------------------------------------------------
# Stage Description Generator
# --------------------------------------------------
def generate_stage_description(stage):

    descriptions = {

        "Procedure Phase":
        "Undergoing the primary treatment or surgical intervention",

        "Immediate Recovery":
        "Acute post-treatment recovery and monitoring phase",

        "Short-term Recovery":
        "Rehabilitation and functional recovery period",

        "Long-term Recovery":
        "Full healing and long-term outcome stabilization"
    }

    return descriptions.get(stage, "")


# --------------------------------------------------
# Timeline JSON Builder
# --------------------------------------------------
def build_timeline_json(stage_counts):

    timeline = []

    completion_scores = compute_completion_scores(stage_counts)

    for stage in stage_counts:

        timeline.append({
            "stage": stage,
            "duration": stage_duration_map.get(stage, ""),
            "description": generate_stage_description(stage),
            "completion": completion_scores.get(stage, 0),
            "mentions": stage_counts[stage]
        })

    return timeline

# --------------------------------------------------
# Main Builder Function
# --------------------------------------------------
def build_timeline_block(corpus):

    if not corpus:
        return {
            "time_mentions": [],
            "stages": []
        }

    # Time mentions
    timeline_mentions = []

    for doc in corpus:
        text = doc["text"] if isinstance(doc, dict) else doc
        timeline_mentions.extend(
            extract_time_mentions(text)
        )

    # Stage detection
    stage_raw = detect_recovery_stages(
        corpus,
        stage_keywords
    )

    # Build JSON
    timeline_json = build_timeline_json(stage_raw)

    return {
        "time_mentions": timeline_mentions,
        "stages": timeline_json
    }