from pipeline.scraper import (
    multi_category_discovery,
    classify_url,
    build_corpus,
    split_corpus_by_source
)

from pipeline.side_effects import run_side_effect_pipeline
from pipeline.sentiment import build_sentiment_block
from pipeline.timeline import build_timeline_block
from pipeline.combinations import build_combination_block
from pipeline.credibility import build_credibility_system
from pipeline.overview import generate_overview

from pipeline.side_effects import (
    side_effect_terms,
    severity_modifiers,
    impact_modifiers,
    duration_modifiers,
    source_weights
)

def run_full_pipeline(treatment):

    print(f"\n🚀 Running pipeline for: {treatment}\n")

    # 1️⃣ Discover URLs
    urls = multi_category_discovery(treatment)

    # 2️⃣ Classify URLs
    classified_urls = [
        {
            "url": url,
            "type": classify_url(url)
        }
        for url in urls
    ]
    print("URLs discovered:", len(urls))
    print(urls[:5])

    # ==============================
    # 1️⃣ Build corpus
    # ==============================
    corpus = build_corpus(classified_urls)

    # ==============================
    # 2️⃣ Split corpus
    # ==============================
    patient_docs, clinical_docs = split_corpus_by_source(corpus)

    # ==============================
    # 3️⃣ Side Effects
    # ==============================
    side_effects = run_side_effect_pipeline(
        corpus,
        side_effect_terms,
        source_weights,
        severity_modifiers,
        impact_modifiers,
        duration_modifiers
    )
    print("Side effects extracted:", len(side_effects))
    # ==============================
    # 4️⃣ Sentiment
    # ==============================
    sentiment = build_sentiment_block(patient_docs)
    print("Sentiment analysis complete:", sentiment)

    # ==============================
    # 5️⃣ Recovery Timeline
    # ==============================
    timeline = build_timeline_block(patient_docs)
    print("Recovery timeline built:", timeline)

    # ==============================
    # 6️⃣ Combinations
    # ==============================
    combinations = build_combination_block(
        corpus,
        treatment
    )
    print("Treatment combinations detected:", len(combinations))

    # ==============================
    # 7️⃣ Credibility
    # ==============================
    credibility = build_credibility_system(
        corpus,
        patient_docs,
        clinical_docs
    )
    print("Credibility assessment complete:", credibility["credibility"]["credibilityScore"])

    # ==============================
    # 8️⃣ Overview (Gemini)
    # ==============================
    overview = generate_overview(
        treatment,
        clinical_docs
    )
    print("Overview generated.")

    # ==============================
    # 🔟 Merge Final JSON
    # ==============================
    final_json = {
        "treatment": treatment,
        "overview": overview,
        "sideEffects": side_effects,
        "sentiment": sentiment,
        "recovery": timeline,
        "combinations": combinations,
        "credibility": credibility["credibility"],
        "sources": credibility["sources"]
    }

    return final_json

