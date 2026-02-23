# pipeline/combinations.py

import re
from collections import Counter


# --------------------------------------------------
# Step 1 — Extract Treatment Candidates
# --------------------------------------------------
def extract_treatment_candidates(corpus):

    pattern = r'\b([A-Za-z0-9\-]+(?:\s[A-Za-z0-9\-]+)?\s(therapy|surgery|replacement|transplant|regimen|procedure|injection|infusion))\b'

    candidates = Counter()

    for doc in corpus:

        text = doc.get("text", "").lower()

        matches = re.findall(pattern, text, re.IGNORECASE)

        for match in matches:
            full_term = match[0].lower()
            candidates[full_term] += 1

    return candidates


# --------------------------------------------------
# Step 2 — Cleaning Candidates
# --------------------------------------------------
invalid_prefixes = [
    "after","before","during","prior","following",
    "including","such as","type of","kind of",
    "form of","course of","line of","phase of",
    "part of","and","or","with","from","through",
    "by","for"
]

invalid_terms = [
    "combination therapy","standard therapy",
    "systemic therapy","initial therapy",
    "first line therapy","maintenance therapy",
    "intensive therapy","cancer therapy",
    "treatment regimen","combination regimen",
    "chemo regimen"
]


def clean_treatment_candidates(candidates):

    cleaned = {}

    for term, count in candidates.items():

        if term in invalid_terms:
            continue

        if any(term.startswith(p) for p in invalid_prefixes):
            continue

        if len(term.split()) < 2:
            continue

        cleaned[term] = count

    return cleaned


# --------------------------------------------------
# Step 3 — Detect Combinations
# --------------------------------------------------
def detect_combinations(corpus, base_treatment, auto_terms):

    combo_counter = Counter()

    for doc in corpus:

        text = doc.get("text", "").lower()

        if base_treatment.lower() not in text:
            continue

        found = [
            term for term in auto_terms
            if term in text and term != base_treatment.lower()
        ]

        for term in found:
            combo_counter[(base_treatment.lower(), term)] += 1

    return combo_counter


# --------------------------------------------------
# Step 4 — Normalize Usage Scores
# --------------------------------------------------
def normalize_combo_scores(combo_counts):

    if not combo_counts:
        return {}

    max_count = max(combo_counts.values())

    return {
        combo: int((count / max_count) * 100)
        for combo, count in combo_counts.items()
    }


# --------------------------------------------------
# Step 5 — Effectiveness Scoring
# --------------------------------------------------
positive_words = [
    "effective","worked","successful","improved",
    "beneficial","helped","recovery","progress",
    "stable","responsive"
]


def compute_combo_effectiveness(corpus, combo_scores):

    effectiveness_scores = {}

    for combo in combo_scores:

        base, other = combo
        mentions = 0
        positive_hits = 0

        for doc in corpus:

            text = doc.get("text", "").lower()

            if base in text and other in text:
                mentions += 1

                if any(word in text for word in positive_words):
                    positive_hits += 1

        effectiveness_scores[combo] = (
            int((positive_hits / mentions) * 100)
            if mentions > 0 else 0
        )

    return effectiveness_scores


# --------------------------------------------------
# Step 6 — Build Final JSON
# --------------------------------------------------
def build_combination_json(
    combo_usage,
    combo_effectiveness,
    top_n=5
):

    sorted_combos = sorted(
        combo_usage.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_combos = []
    lookup = {}

    for combo, score in sorted_combos:

        base, other = combo

        entry = {
            "therapy": other.title(),
            "coUsage": score,
            "effectiveness": combo_effectiveness.get(combo, 0)
        }

        top_combos.append(entry)

        lookup[other.lower()] = {
            "coUsage": score,
            "effectiveness": combo_effectiveness.get(combo, 0)
        }

    return {
        "topCombinations": top_combos[:top_n],
        "combinationLookup": lookup
    }


# --------------------------------------------------
# MASTER BUILDER FUNCTION
# --------------------------------------------------
def build_combination_block(corpus, treatment):

    raw_candidates = extract_treatment_candidates(corpus)

    cleaned_candidates = clean_treatment_candidates(
        raw_candidates
    )

    auto_terms = list(cleaned_candidates.keys())

    combo_counts = detect_combinations(
        corpus,
        treatment,
        auto_terms
    )

    combo_usage_scores = normalize_combo_scores(
        combo_counts
    )

    combo_effectiveness = compute_combo_effectiveness(
        corpus,
        combo_usage_scores
    )

    return build_combination_json(
        combo_usage_scores,
        combo_effectiveness,
        top_n=5
    )