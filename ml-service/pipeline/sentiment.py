# pipeline/sentiment.py

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter

# -----------------------------
# Initialize analyzer
# -----------------------------
analyzer = SentimentIntensityAnalyzer()

# -----------------------------
# Sentiment Classification
# -----------------------------
def classify_sentiment(text):

    score = analyzer.polarity_scores(text)["compound"]

    if score >= 0.05:
        return "positive"
    elif score <= -0.05:
        return "negative"
    else:
        return "neutral"


# -----------------------------
# Emotion Lexicon
# -----------------------------
emotion_keywords = {

    "Hope": [
        "hope","hopeful","optimistic","recovery",
        "positive outcome","healing"
    ],

    "Fear": [
        "fear","scared","terrified","afraid",
        "surgery fear","anesthesia fear"
    ],

    "Anxiety": [
        "anxious","worried","panic","nervous",
        "pre surgery anxiety"
    ],

    "Relief": [
        "relieved","pain gone","finally better",
        "vision restored"
    ],

    "Gratitude": [
        "grateful","thankful","blessed",
        "doctor saved me"
    ],

    "Satisfaction": [
        "happy with results","successful surgery",
        "worth it"
    ],

    "Frustration": [
        "frustrated","slow recovery",
        "complications"
    ],

    "Regret": [
        "regret","shouldn’t have done",
        "side effects too much"
    ]
}


# -----------------------------
# Emotion Detection
# -----------------------------
def detect_emotions(corpus, lexicon):

    emotion_scores = {emotion: 0 for emotion in lexicon}

    for doc in corpus:
        text = doc["text"].lower()

        for emotion, keywords in lexicon.items():
            for word in keywords:
                if word in text:
                    emotion_scores[emotion] += 1

    return emotion_scores


# -----------------------------
# Normalize Emotion Scores
# -----------------------------
def normalize_emotions(emotion_scores):

    max_val = max(emotion_scores.values()) if emotion_scores else 0

    return [
        {
            "label": emotion,
            "value": int((count / max_val) * 100) if max_val > 0 else 0
        }
        for emotion, count in emotion_scores.items()
    ]


# -----------------------------
# Main Builder Function
# -----------------------------
def build_sentiment_block(corpus):

    if not corpus:
        return {
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "emotions": []
        }

    # Extract documents
    documents = [
        doc["text"] if isinstance(doc, dict) else doc
        for doc in corpus
    ]

    # Sentiment labels
    sentiment_labels = [
        classify_sentiment(doc)
        for doc in documents
    ]

    sentiment_counts = Counter(sentiment_labels)
    total = sum(sentiment_counts.values())

    sentiment_percent = {
        "positive": int((sentiment_counts["positive"] / total) * 100),
        "neutral": int((sentiment_counts["neutral"] / total) * 100),
        "negative": int((sentiment_counts["negative"] / total) * 100)
    }

    # Emotion detection
    emotion_raw = detect_emotions(corpus, emotion_keywords)
    emotion_json = normalize_emotions(emotion_raw)

    # Final JSON
    sentiment_json = {
        "positive": sentiment_percent["positive"],
        "neutral": sentiment_percent["neutral"],
        "negative": sentiment_percent["negative"],
        "emotions": emotion_json
    }

    return sentiment_json