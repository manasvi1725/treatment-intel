side_effect_terms = [

# ───────── SYSTEMIC ─────────
"fatigue","fever","infection","pain","weakness","swelling","inflammation",

# ───────── GI ─────────
"nausea","vomiting","diarrhea","constipation",
"loss of appetite","stomach pain","abdominal pain","bloating",

# ───────── NEUROLOGICAL ─────────
"headache","dizziness","neuropathy","memory loss",
"confusion","brain fog","seizures","nerve damage",

# ───────── PSYCHOLOGICAL ─────────
"anxiety","depression","stress","fear",
"mood swings","emotional distress","panic attacks",

# ───────── MUSCULOSKELETAL ─────────
"joint pain","muscle pain","bone pain",
"stiffness","mobility issues","implant pain",

# ───────── CARDIAC ─────────
"chest pain","palpitations","arrhythmia",
"hypertension","blood clots",

# ───────── RESPIRATORY ─────────
"breathlessness","shortness of breath",
"lung infection","cough","fluid in lungs",

# ───────── DERMATOLOGICAL ─────────
"rash","itching","scarring","skin irritation",
"hair loss","burning sensation",

# ───────── OPHTHALMIC ─────────
"blurred vision","dry eyes","light sensitivity",
"vision loss","eye pain",

# ───────── ENT ─────────
"hearing loss","ear pain","tinnitus",
"nasal congestion","loss of smell",

# ───────── ORAL ─────────
"mouth sores","dry mouth","gum bleeding",
"difficulty swallowing",

# ───────── SURGICAL SPECIFIC ─────────
"bleeding","bruising","scar pain",
"implant failure","graft rejection",
"wound infection","delayed healing",

# ───────── REPRODUCTIVE ─────────
"infertility","menstrual changes",
"hormonal imbalance","sexual dysfunction"
]

source_weights = {
    "clinical": 1.0,
    "research": 1.2,
    "blog": 1.5,
    "forum": 2.0,
    "news": 0.8
}

severity_modifiers = {

# Mild
"mild": 30,"slight": 20,"minimal": 15,
"manageable": 35,"tolerable": 40,

# Moderate
"moderate": 60,"uncomfortable": 55,
"persistent": 65,"frequent": 60,

# Severe
"severe": 85,"intense": 80,
"debilitating": 90,"extreme": 95,
"unbearable": 100,

# Functional impact
"unable to walk": 95,
"couldn't move": 95,
"bedridden": 100,
"missed work": 80,
"hospitalized": 95,

# Recovery impact
"delayed healing": 75,
"chronic pain": 85,
"permanent damage": 100
}

impact_modifiers = {
    "couldn't": 85,
    "unable to": 85,
    "struggled": 70,
    "hard to": 60,
    "interfered with": 75,
    "missed work": 80,
    "hospital": 95,
    "bedridden": 95,
    "stopped treatment": 90,
    "dose reduced": 85
}

duration_modifiers = {
    "for weeks": 70,
    "for months": 85,
    "persistent": 75,
    "every day": 80,
    "daily": 80,
    "constant": 90
}

from collections import defaultdict
import re


# ==============================
# WEIGHTED FREQUENCY
# ==============================

def extract_weighted_frequency(corpus, terms, source_weights):

    counter = defaultdict(float)

    for doc in corpus:

        text = doc["text"].lower()
        source_type = doc["type"]
        weight = source_weights.get(source_type, 1.0)

        for term in terms:

            matches = len(re.findall(rf"\b{re.escape(term)}\b", text))
            counter[term] += matches * weight

    return counter


# ==============================
# NORMALIZATION
# ==============================

def normalize_frequency(counter):

    if not counter:
        return {}

    max_count = max(counter.values())

    if max_count == 0:
        return {k: 0 for k in counter}

    freq_percent = {
        k: int((v / max_count) * 100)
        for k, v in counter.items()
    }

    return freq_percent


# ==============================
# SEVERITY ESTIMATION
# ==============================

def estimate_severity_v4(corpus, terms,
                         severity_modifiers,
                         impact_modifiers,
                         duration_modifiers):

    severity_scores = {}

    for term in terms:

        scores = []

        for doc in corpus:

            sentences = doc["text"].lower().split(".")

            for s in sentences:

                if term in s:

                    # Explicit severity words
                    for phrase, value in severity_modifiers.items():
                        if phrase in s:
                            scores.append(value)

                    # Impact indicators
                    for phrase, value in impact_modifiers.items():
                        if phrase in s:
                            scores.append(value)

                    # Duration indicators
                    for phrase, value in duration_modifiers.items():
                        if phrase in s:
                            scores.append(value)

        if scores:
            severity_scores[term] = int(sum(scores) / len(scores))
        else:
            severity_scores[term] = 0

    return severity_scores


# ==============================
# BUILD JSON
# ==============================

def build_side_effect_json(freq, severity):

    side_effects = []

    for term in freq:

        if freq[term] > 0:

            side_effects.append({
                "name": term.title(),
                "frequency": freq[term],
                "severity": severity.get(term, 0)
            })

    # Sort by frequency
    side_effects.sort(
        key=lambda x: x["frequency"],
        reverse=True
    )

    return side_effects


# ==============================
# MASTER PIPELINE FUNCTION
# ==============================

def run_side_effect_pipeline(
    corpus,
    side_effect_terms,
    source_weights,
    severity_modifiers,
    impact_modifiers,
    duration_modifiers
):

    print("Running weighted side-effect analysis...")
    print("Step 1: Frequency")
    weighted_counts = extract_weighted_frequency(
        corpus,
        side_effect_terms,
        source_weights
    )
    print("Step 2: Normalize")

    frequency_scores = normalize_frequency(weighted_counts)
    print("Step 3: Severity")
    severity_scores = estimate_severity_v4(
        corpus,
        side_effect_terms,
        severity_modifiers,
        impact_modifiers,
        duration_modifiers
    )
    print("Step 4: JSON build")
    side_effect_block = build_side_effect_json(
        frequency_scores,
        severity_scores
    )

    return side_effect_block