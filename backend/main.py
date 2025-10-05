from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
from collections import Counter
import re
from nltk.corpus import stopwords
import os
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel
from typing import List

# --- Configuración de la IA ---
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# ---------------------------

app = FastAPI()

# ⚠️ CORRECCIÓN DE CORS: Se quita la barra final "/" y se añade localhost:3000
origins = [
    "http://localhost:3000",
    "https://biofinderr.vercel.app", # Tu URL anterior
    "https://nasa-hkicwnj59-rafa093spartans-projects.vercel.app", # La nueva URL del error
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("publications.json", "r", encoding="utf-8") as f:
    publications = json.load(f)

# ... (El resto de tus funciones como get_word_frequencies, search, etc. no necesitan cambios) ...
def get_word_frequencies():
    # ... (sin cambios)
    STOP_WORDS = set(stopwords.words('english'))
    STOP_WORDS.update(["study", "results", "data", "methods", "introduction", "conclusions", "background", "purpose", "figure", "table"])
    all_keywords = []
    for pub in publications:
        if "keywords" in pub and pub["keywords"]: all_keywords.extend(pub["keywords"])
    if not all_keywords:
        all_text = " ".join([pub.get("resumen", "") for pub in publications])
        words = re.findall(r'\b\w+\b', all_text.lower())
        all_keywords = [word for word in words if word not in STOP_WORDS and not word.isdigit() and len(word) > 2]
    return Counter(all_keywords)

@app.get("/search")
def search_publications(q: str = ""):
    # ... (sin cambios)
    if not q: return publications
    query = q.lower()
    results = []
    for pub in publications:
        if query in pub["titulo"].lower() or query in pub.get("resumen", "").lower():
             results.append(pub)
    return results

@app.get("/top-keywords")
def get_top_keywords_data():
    # ... (sin cambios)
    word_counts = get_word_frequencies()
    return [{"text": word, "value": count} for word, count in word_counts.most_common(50)]

# --- SECCIÓN DE IA ---

class SummarizeRequest(BaseModel):
    text: str

@app.post("/summarize")
def get_summary(request: SummarizeRequest):
    # ... (sin cambios)
    model = genai.GenerativeModel('models/gemini-pro-latest')
    prompt = f'Eres un experto en comunicación científica...'
    try:
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        return {"error": str(e)}

class ChatMessage(BaseModel):
    role: str
    parts: List[str]

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    question: str
    context: str

@app.post("/chat")
def handle_chat(request: ChatRequest):
    # ... (sin cambios)
    model = genai.GenerativeModel('models/gemini-pro-latest')
    chat = model.start_chat(history=[msg.dict() for msg in request.history])
    prompt = f"Contexto: {request.context}\n---\nPregunta: {request.question}\n\nResponde basándote solo en el contexto."
    try:
        response = chat.send_message(prompt)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}

# --- ENDPOINT DE BÚSQUEDA CON IA (MEJORADO) ---
@app.post("/search-ai")
def search_ai(request: SummarizeRequest):
    model = genai.GenerativeModel('models/gemini-pro-latest')
    
    prompt = f"""
    Eres un asistente de búsqueda. Basado en la siguiente consulta del usuario, extrae las 3 a 5 palabras clave o conceptos más importantes.
    Devuelve SOLAMENTE las palabras clave, separadas por comas, sin ninguna otra palabra, saludo o introducción.

    Consulta del usuario: "{request.text}"
    Palabras clave:
    """

    try:
        response = model.generate_content(prompt)
        # Limpiamos la respuesta de la IA para mayor seguridad
        cleaned_response = response.text.strip().replace('\n', '')
        keywords = [k.strip().lower() for k in cleaned_response.split(",") if k.strip()]
        
        if not keywords:
            return []

        results = []
        result_ids = set() # Para evitar duplicados

        for pub in publications:
            text_to_search = (pub["titulo"] + " " + pub.get("resumen", "")).lower()
            for k in keywords:
                if k in text_to_search and pub["id"] not in result_ids:
                    results.append(pub)
                    result_ids.add(pub["id"])
                    break
        return results
    except Exception as e:
        print(f"Error en search-ai: {e}")
        return {"error": str(e)}