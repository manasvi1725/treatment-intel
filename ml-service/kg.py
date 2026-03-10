from collections import Counter


# -----------------------------
# OUTCOME TERMS
# -----------------------------
outcome_terms = [

    "remission",
    "complete remission",
    "partial remission",

    "tumor reduction",
    "tumour reduction",
    "tumor shrinkage",
    "tumour shrinkage",

    "disease free",
    "disease-free survival",

    "improved survival",
    "long term survival",

    "recovery",
    "successful treatment",
    "positive outcome",

    "better prognosis",
    "progression free survival"
]


# -----------------------------
# TARGET TERMS
# -----------------------------
target_terms = [

    "cancer cells",
    "tumor cells",
    "tumour cells",

    "immune system",
    "t cells",
    "b cells",
    "white blood cells",

    "cell division",
    "dna damage",
    "tumor growth",

    "angiogenesis",
    "hormone receptors",
    "estrogen receptor",
    "progesterone receptor",

    "gene mutation",
    "protein signaling"
]


# ==============================
# ENTITY EXTRACTION
# ==============================

def extract_entities(corpus, dictionary):

    counter = Counter()

    for doc in corpus:

        text = doc["text"].lower()

        for term in dictionary:

            if term in text:
                counter[term] += 1

    return counter


# ==============================
# NORMALIZATION
# ==============================

def normalize(counter):

    if not counter:
        return []

    max_val = max(counter.values())

    nodes = []

    for term, count in counter.items():

        nodes.append({
            "name": term.title(),
            "value": int((count / max_val) * 100)
        })

    return nodes


# ==============================
# CONVERT SIDE EFFECTS → KG NODES
# ==============================

def convert_side_effect_nodes(side_effect_block):

    nodes = []

    for s in side_effect_block:

        nodes.append({
            "name": s["name"],
            "value": s["frequency"],
            "severity": s["severity"]
        })

    return nodes


# ==============================
# MAIN KG BUILDER
# ==============================

def build_knowledge_nodes(corpus, side_effect_block):

    # Extract outcomes
    outcome_counts = extract_entities(corpus, outcome_terms)

    # Extract targets
    target_counts = extract_entities(corpus, target_terms)

    knowledge_nodes = {

        "side_effects": convert_side_effect_nodes(side_effect_block),

        "outcomes": normalize(outcome_counts),

        "targets": normalize(target_counts)
    }

    return knowledge_nodes