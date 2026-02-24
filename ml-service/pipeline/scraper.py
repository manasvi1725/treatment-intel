import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from serpapi import GoogleSearch
from tqdm import tqdm
import re
from newspaper import Article
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from urllib.parse import urlparse
import os
from dotenv import load_dotenv

load_dotenv()
SERP_API_KEY = os.getenv("SERP_API_KEY")

def multi_category_discovery(treatment, num_results=10, max_total=120):

    query_types = [
        # Clinical / Evidence
        f"{treatment} treatment clinical trials",
        f"{treatment} medical research paper",
        f"{treatment} treatment effectiveness study",
        f"{treatment} survival rate study",

        # Patient Discussions
        f"{treatment} patient discussion forum",
        f"{treatment} patient experiences reddit",
        f"{treatment} support group discussions",
        f"{treatment} real patient experiences",

        # Recovery Journeys
        f"{treatment} recovery journey blog",
        f"{treatment} recovery timeline patients",
        f"{treatment} life after {treatment}",
        f"{treatment} post treatment recovery experience",

        # Side Effects
        f"{treatment} side effects patient reported",
        f"{treatment} long term side effects",
        f"{treatment} worst side effects experiences",
        f"{treatment} side effects forum discussion",

        # Combination Therapies
        f"{treatment} combination therapy outcomes",
        f"{treatment} combined with immunotherapy",
        f"{treatment} multi modality treatment",
        f"{treatment} adjunct therapy research"
    ]

    unique_urls = set()

    for query in query_types:

        if len(unique_urls) >= max_total:
            break

        print(f"\nSearching: {query}")

        params = {
            "engine": "google",
            "q": query,
            "api_key": SERP_API_KEY,
            "num": num_results
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        if "organic_results" in results:
            for r in results["organic_results"]:

                clean_url = r["link"].split("?")[0]

                if clean_url not in unique_urls:
                    unique_urls.add(clean_url)

                if len(unique_urls) >= max_total:
                    break

    print("\nTotal unique URLs collected:", len(unique_urls))

    return list(unique_urls)
def classify_url(url):

    url_lower = url.lower()
    domain = urlparse(url_lower).netloc

    # ------------------------
    # 1️⃣ Known Forum Platforms
    # ------------------------
    forum_domains = [
        "reddit",
        "healthunlocked",
        "inspire",
        "patient.info",
        "cancerforums",
        "medhelp",
        "dailystrength",
        "community",
        "forum"
    ]

    for f in forum_domains:
        if f in domain:
            return "forum"

    # ------------------------
    # 2️⃣ Blog Indicators
    # ------------------------
    if any(word in url_lower for word in [
        "blog",
        "story",
        "experience",
        "journey",
        "patient-story",
        "my-"
    ]):
        return "blog"

    # ------------------------
    # 3️⃣ Research / Academic
    # ------------------------
    if any(word in domain for word in [
        "pubmed",
        "nih",
        "who",
        "ncbi",
        "jamanetwork",
        "thelancet",
        "nejm",
        "bmj",
        ".edu"
    ]):
        return "research"

    if any(word in url_lower for word in [
        "clinical-trial",
        "study",
        "trial",
        "research",
        "meta-analysis"
    ]):
        return "research"

    # ------------------------
    # 4️⃣ Hospital / Medical Sites
    # ------------------------
    if any(word in domain for word in [
        "mayoclinic",
        "clevelandclinic",
        "hopkins",
        "webmd",
        "healthline"
    ]):
        return "clinical"

    # ------------------------
    # 5️⃣ News
    # ------------------------
    if any(word in domain for word in [
        "news",
        "bbc",
        "cnn",
        "nytimes"
    ]):
        return "news"

    # ------------------------
    # 6️⃣ Fallback
    # ------------------------
    return "clinical"

    
def extract_article_text(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text
    except:
        return ""


def extract_forum_text(url):
    try:
        html = requests.get(url).text
        soup = BeautifulSoup(html, "lxml")
        
        paragraphs = soup.find_all("p")
        text = " ".join([p.get_text(strip=True) for p in paragraphs])
        
        return text
    
    except:
        return ""


def fetch_content(url, source_type):
    
    if source_type in ["clinical", "research", "news", "blog"]:
        return extract_article_text(url)
    
    if source_type == "forum":
        return extract_forum_text(url)
    
    return ""


def clean_text(text):

    text = re.sub(r"\s+", " ", text)
    text = text.strip()

    return text


# ==============================
# DEDUPLICATION
# ==============================

def remove_duplicates(docs, threshold=0.85):

    if len(docs) <= 1:
        return docs

    texts = [d["text"] for d in docs]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(texts)

    similarity_matrix = cosine_similarity(tfidf_matrix)

    keep_indices = []
    visited = set()

    for i in range(len(texts)):

        if i in visited:
            continue

        keep_indices.append(i)

        for j in range(i + 1, len(texts)):
            if similarity_matrix[i][j] > threshold:
                visited.add(j)

    return [docs[i] for i in keep_indices]


# ==============================
# BUILD FINAL CORPUS
# ==============================
def multi_category_discovery(treatment, num_results=10, max_total=120):

    query_types = [
        # Clinical / Evidence
        f"{treatment} treatment clinical trials",
        f"{treatment} medical research paper",
        f"{treatment} treatment effectiveness study",
        f"{treatment} survival rate study",

        # Patient Discussions
        f"{treatment} patient discussion forum",
        f"{treatment} patient experiences reddit",
        f"{treatment} support group discussions",
        f"{treatment} real patient experiences",

        # Recovery Journeys
        f"{treatment} recovery journey blog",
        f"{treatment} recovery timeline patients",
        f"{treatment} life after {treatment}",
        f"{treatment} post treatment recovery experience",

        # Side Effects
        f"{treatment} side effects patient reported",
        f"{treatment} long term side effects",
        f"{treatment} worst side effects experiences",
        f"{treatment} side effects forum discussion",

        # Combination Therapies
        f"{treatment} combination therapy outcomes",
        f"{treatment} combined with immunotherapy",
        f"{treatment} multi modality treatment",
        f"{treatment} adjunct therapy research"
    ]

    unique_urls = set()

    for query in query_types:

        if len(unique_urls) >= max_total:
            break

        print(f"\nSearching: {query}")

        params = {
            "engine": "google",
            "q": query,
            "api_key": SERP_API_KEY,
            "num": num_results
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        if "organic_results" in results:
            for r in results["organic_results"]:

                clean_url = r["link"].split("?")[0]

                if clean_url not in unique_urls:
                    unique_urls.add(clean_url)

                if len(unique_urls) >= max_total:
                    break

    print("\nTotal unique URLs collected:", len(unique_urls))

    return list(unique_urls)
from concurrent.futures import ThreadPoolExecutor, as_completed

def build_corpus(classified_urls):

    corpus = []

    print("\n📥 Fetching documents...\n")

    def process(item):

        print("Fetching:", item["url"])

        content = fetch_content(item["url"], item["type"])

        if isinstance(content, str) and len(content) > 300:
            return {
                "url": item["url"],
                "type": item["type"],
                "text": content
            }

        return None

    with ThreadPoolExecutor(max_workers=10) as executor:

        futures = [executor.submit(process, item) for item in classified_urls]

        for future in tqdm(as_completed(futures), total=len(futures)):
            result = future.result()
            if result:
                corpus.append(result)

    print("Documents collected:", len(corpus))
    corpus = remove_duplicates(corpus)

    return corpus


def split_corpus_by_source(corpus):

    patient_docs = []
    clinical_docs = []

    for doc in corpus:

        text = doc.get("text", "").lower()
        src_type = doc.get("type", "")

        # Patient sources
        if src_type in ["forum", "blog", "discussion"]:
            patient_docs.append(doc)

        # Clinical / research sources
        elif src_type in ["research", "clinical", "news"]:
            clinical_docs.append(doc)

    print("\n📊 Corpus Split:")
    print("Patient docs:", len(patient_docs))
    print("Clinical docs:", len(clinical_docs))

    return patient_docs, clinical_docs

