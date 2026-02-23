# --------------------------------------------
# SOURCE INTELLIGENCE
# --------------------------------------------

from urllib.parse import urlparse
from collections import defaultdict, Counter


def extract_source_name(url):

    domain = urlparse(url).netloc.lower()

    if "reddit" in domain:
        return "Reddit"
    elif "healthunlocked" in domain:
        return "HealthUnlocked"
    elif "inspire" in domain:
        return "Inspire"
    elif "patient" in domain:
        return "Patient Blogs"
    elif "pubmed" in domain:
        return "PubMed"
    elif "nih" in domain:
        return "NIH"
    else:
        return domain.replace("www.", "").split(".")[0].title()


def compute_source_stats(corpus):

    source_counter = defaultdict(int)
    source_type_map = {}

    for doc in corpus:

        url = doc.get("url", "")
        src_type = doc.get("type", "unknown")

        source_name = extract_source_name(url)

        source_counter[source_name] += 1
        source_type_map[source_name] = src_type

    return source_counter, source_type_map


def normalize_discussions(source_counts):

    max_val = max(source_counts.values()) if source_counts else 1

    return {
        source: int((count / max_val) * 10000)
        for source, count in source_counts.items()
    }


def build_source_json(
    corpus,
    source_counts,
    source_types,
    discussion_scores
):

    sources = []
    seen_sources = set()

    for doc in corpus:

        url = doc.get("url", "")
        source_name = extract_source_name(url)

        if source_name in seen_sources:
            continue

        sources.append({
            "name": source_name,
            "type": source_types.get(source_name, "Unknown").title(),
            "discussions": discussion_scores.get(source_name, 0),
            "url": url
        })

        seen_sources.add(source_name)

    return sources


# --------------------------------------------
# MISINFORMATION + CREDIBILITY
# --------------------------------------------

clinical_side_effect_terms = [
    "nausea", "fatigue", "hair loss",
    "infection", "neuropathy",
    "anemia", "vomiting"
]


def extract_side_effect_counts(docs, terms):

    counts = Counter()

    for doc in docs:
        text = (
            doc["text"]
            if isinstance(doc, dict)
            else str(doc)
        ).lower()

        for term in terms:
            if term in text:
                counts[term] += text.count(term)

    return counts


def detect_misinformation(patient_counts, clinical_counts):

    flags = []

    for effect, p_count in patient_counts.items():

        c_count = clinical_counts.get(effect, 0)

        if p_count > 3 and c_count == 0:
            flags.append(
                f"Unverified side effect claim: {effect}"
            )

    return flags


def detect_recovery_mismatch(patient_docs):

    flags = []

    unrealistic_terms = [
        "recovered in 2 weeks",
        "fully cured in 1 month",
        "instant recovery"
    ]

    for doc in patient_docs:

        text = (
            doc["text"]
            if isinstance(doc, dict)
            else str(doc)
        ).lower()

        for term in unrealistic_terms:
            if term in text:
                flags.append(
                    "Unrealistic recovery claim detected"
                )

    return list(set(flags))


def compute_credibility_score(
    patient_docs,
    clinical_docs,
    misinfo_flags
):

    if not patient_docs:
        return 50

    alignment = len(clinical_docs) / (
        len(patient_docs) + len(clinical_docs)
    )

    penalty = len(misinfo_flags) * 5

    score = int((alignment * 100) - penalty)

    return max(0, min(score, 100))


# --------------------------------------------
# MASTER CREDIBILITY BUILDER
# --------------------------------------------

def build_credibility_system(
    corpus,
    patient_docs,
    clinical_docs
):

    # -----------------------------
    # Source Intelligence
    # -----------------------------
    source_counts, source_types = compute_source_stats(
        corpus
    )

    discussion_scores = normalize_discussions(
        source_counts
    )

    sources = build_source_json(
        corpus,
        source_counts,
        source_types,
        discussion_scores
    )

    # -----------------------------
    # Misinformation Detection
    # -----------------------------
    clinical_counts = extract_side_effect_counts(
        clinical_docs,
        clinical_side_effect_terms
    )

    patient_counts = extract_side_effect_counts(
        patient_docs,
        clinical_side_effect_terms
    )

    misinfo_flags = detect_misinformation(
        patient_counts,
        clinical_counts
    )

    recovery_flags = detect_recovery_mismatch(
        patient_docs
    )

    all_flags = misinfo_flags + recovery_flags

    # -----------------------------
    # Credibility Score
    # -----------------------------
    score = compute_credibility_score(
        patient_docs,
        clinical_docs,
        all_flags
    )

    credibility = {
        "credibilityScore": score,
        "misinformationFlags": all_flags,
        "insight":
            "Most patient-reported insights align with clinical literature."
            if score > 60 else
            "Some patient discussions deviate from established clinical evidence."
    }

    # -----------------------------
    # Final Combined Block
    # -----------------------------
    return {
        "sources": sources,
        "credibility": credibility
    }