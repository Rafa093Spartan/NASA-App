# NasabioDasbohard/backend/main.py (Versión final)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
from collections import Counter
import re
from nltk.corpus import stopwords
from wordcloud import WordCloud
import io

app = FastAPI()

origins = [ "http://localhost:3000" ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("publications.json", "r", encoding="utf-8") as f:
    publications = json.load(f)

def get_word_frequencies():
    STOP_WORDS = set(stopwords.words('english'))
    STOP_WORDS.update(["study", "results", "data", "methods", "introduction", "conclusions", "background", "purpose", "figure", "table"])
    
    all_keywords = []
    for pub in publications:
        if "keywords" in pub and pub["keywords"]:
            all_keywords.extend(pub["keywords"])
    if not all_keywords:
        all_text = " ".join([pub.get("resumen", "") for pub in publications])
        words = re.findall(r'\b\w+\b', all_text.lower())
        all_keywords = [word for word in words if word not in STOP_WORDS and not word.isdigit() and len(word) > 2]
    return Counter(all_keywords)

@app.get("/search")
def search_publications(q: str = ""):
    if not q:
        return publications
    query = q.lower()
    results = []
    for pub in publications:
        titulo_match = query in pub["titulo"].lower()
        resumen_match = query in pub.get("resumen", "").lower()
        keywords_match = any(query in keyword.lower() for keyword in pub.get("keywords", []))
        if titulo_match or resumen_match or keywords_match:
            results.append(pub)
    return results

@app.get("/top-keywords")
def get_top_keywords_data():
    word_counts = get_word_frequencies()
    return [{"text": word, "value": count} for word, count in word_counts.most_common(50)]

@app.get("/wordcloud-image")
def get_wordcloud_image():
    word_counts = get_word_frequencies()
    wc = WordCloud(width=800, height=400, background_color="white", colormap="viridis").generate_from_frequencies(word_counts)
    img_buffer = io.BytesIO()
    wc.to_image().save(img_buffer, 'PNG')
    img_buffer.seek(0)
    return StreamingResponse(img_buffer, media_type="image/png")