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
from pipeline.kg import build_knowledge_nodes
from pipeline.success import build_success_block
from pipeline.cost import build_cost_block

from pipeline.side_effects import (
    side_effect_terms,
    severity_modifiers,
    impact_modifiers,
    duration_modifiers,
    source_weights
)


def run_full_pipeline(treatment):

    print(f"\n🚀 Running pipeline for: {treatment}\n")

    # ==============================
    # 1️⃣ Discover URLs
    # ==============================

    urls = multi_category_discovery(treatment)

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
    # 2️⃣ Build Corpus
    # ==============================

    corpus = build_corpus(classified_urls)

    # ==============================
    # 3️⃣ Split Corpus
    # ==============================

    patient_docs, clinical_docs = split_corpus_by_source(corpus)

    # ==============================
    # 4️⃣ Side Effects
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
    # 5️⃣ Sentiment
    # ==============================

    sentiment = build_sentiment_block(patient_docs)

    print("Sentiment analysis complete")

    # ==============================
    # 6️⃣ Recovery Timeline
    # ==============================

    timeline = build_timeline_block(patient_docs)

    print("Recovery timeline built")

    # ==============================
    # 7️⃣ Treatment Combinations
    # ==============================

    combinations = build_combination_block(
        corpus,
        treatment
    )

    print("Treatment combinations detected:", len(combinations))

    # ==============================
    # 8️⃣ Credibility
    # ==============================

    credibility = build_credibility_system(
        corpus,
        patient_docs,
        clinical_docs
    )

    print(
        "Credibility score:",
        credibility["credibility"]["credibilityScore"]
    )

    # ==============================
    # 9️⃣ Overview (Gemini)
    # ==============================

    overview = generate_overview(
        treatment,
        clinical_docs
    )

    print("Overview generated")

    # ==============================
    # 🔟 Success Estimation
    # ==============================

    success = build_success_block(corpus)

    print("Success rate estimated:", success)

    # ==============================
    # 1️⃣1️⃣ Cost Estimation
    # ==============================

    cost = build_cost_block(corpus)

    print("Cost range estimated:", cost)

    # ==============================
    # 1️⃣2️⃣ Knowledge Graph Nodes
    # ==============================

    knowledge_nodes = build_knowledge_nodes(
        corpus,
        side_effects
    )

    print("Knowledge nodes extracted")

    # ==============================
    # 1️⃣3️⃣ Final JSON
    # ==============================

    final_json = {

        "treatment": treatment,

        "overview": overview,

        "sideEffects": side_effects,

        "sentiment": sentiment,

        "recovery": timeline,

        "success": success,

        "cost": cost,

        "combinations": combinations,

        "knowledgeNodes": knowledge_nodes,

        "credibility": credibility["credibility"],

        "sources": credibility["sources"]
    }

    return final_json