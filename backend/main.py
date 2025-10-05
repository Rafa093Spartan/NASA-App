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

# ⚠️ Aquí corregimos los orígenes permitidos
origins = [
    "http://localhost:3000",  # React (frontend)
    "http://localhost:8000"   # FastAPI (backend)
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

# --- SECCIÓN DE IA (ACTUALIZADA) ---

class SummarizeRequest(BaseModel):
    text: str

@app.post("/summarize")
def get_summary(request: SummarizeRequest):
    model = genai.GenerativeModel('models/gemini-pro-latest')
    prompt = f'Eres un experto en comunicación científica. Tu misión es tomar el siguiente resumen técnico (abstract) de una publicación de biología espacial y reescribirlo en un párrafo corto (máximo 4 oraciones) que sea fácil de entender para un público general, como un estudiante de preparatoria. No uses jerga complicada. Resumen técnico: "{request.text}" Resumen simplificado:'
    try:
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        print(f"Ocurrió un error con la API de Google en summarize: {e}")
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
    model = genai.GenerativeModel('models/gemini-pro-latest')
    chat_history = []
    for message in request.history:
        chat_history.append({'role': message.role, 'parts': message.parts})
    
    chat = model.start_chat(history=chat_history)
    
    prompt = f"Contexto: Estás respondiendo preguntas sobre el siguiente resumen de una publicación científica de la NASA.\n---\n{request.context}\n---\nPregunta del usuario: {request.question}\n\nResponde la pregunta basándote únicamente en el contexto proporcionado. Si la respuesta no está en el texto, di que no tienes esa información."
    
    try:
        response = chat.send_message(prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Ocurrió un error con la API de Google en el chat: {e}")
        return {"error": str(e)}

@app.post("/search-ai")
def search_ai(request: SummarizeRequest):
    model = genai.GenerativeModel('models/gemini-pro-latest')
    
    prompt = f"""
    Eres un asistente de búsqueda de publicaciones científicas.
    El usuario escribió: "{request.text}".
    Devuelve SOLO las palabras clave principales que debería usar
    para buscar en una base de datos de artículos científicos.
    Responde con una lista separada por comas.
    """

    try:
        response = model.generate_content(prompt)
        keywords = response.text.split(",")
        results = []
        for pub in publications:
            titulo = pub["titulo"].lower()
            resumen = pub.get("resumen", "").lower()
            for k in keywords:
                k = k.strip().lower()
                if k and (k in titulo or k in resumen):
                    results.append(pub)
                    break
        return results
    except Exception as e:
        print(f"Error en search-ai: {e}")
        return {"error": str(e)}
