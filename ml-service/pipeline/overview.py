# --------------------------------------------
# pipeline/overview.py
# --------------------------------------------

import google.generativeai as genai
import json
import re
import os


# --------------------------------------------
# Configure Gemini
# --------------------------------------------

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# --------------------------------------------
# Prompt Builder
# --------------------------------------------

def build_overview_prompt(treatment, clinical_corpus):

    # Merge top clinical docs
    context = " ".join(
        doc["text"] if isinstance(doc, dict) else str(doc)
        for doc in clinical_corpus[:20]
    )[:12000]

    prompt = f"""
You are a medical intelligence system.

Generate a structured treatment overview for: {treatment}

Use clinical, neutral, educational tone.

Return JSON with fields:

1. summary → What treatment is
2. procedure → How it is performed
3. recommendedFor → Conditions where used
4. duration → Typical treatment duration

Use the context below:

{context}
"""

    return prompt


# --------------------------------------------
# JSON Extractor
# --------------------------------------------

def extract_json(text):

    text = re.sub(r"```json|```", "", text)

    try:
        return json.loads(text)
    except:
        return {
            "summary": "Overview generation failed",
            "procedure": "",
            "recommendedFor": "",
            "duration": ""
        }


# --------------------------------------------
# MAIN BUILDER FUNCTION
# --------------------------------------------

def generate_overview(
    treatment,
    clinical_docs
):

    if not clinical_docs:
        return {
            "summary": "No clinical overview available",
            "procedure": "",
            "recommendedFor": "",
            "duration": ""
        }

    prompt = build_overview_prompt(
        treatment,
        clinical_docs
    )

    response = model.generate_content(prompt)

    overview_json = extract_json(response.text)

    return overview_json