# main.py (versión mejorada con búsqueda en keywords)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

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

@app.get("/publications")
def get_publications():
    return publications

@app.get("/search")
def search_publications(q: str):
    if not q:
        return []

    query = q.lower()
    results = []

    for pub in publications:
        titulo_match = query in pub["titulo"].lower()
        resumen_match = query in pub.get("resumen", "").lower()
        
        # --- NUEVO: Buscar también en las palabras clave ---
        keywords_match = any(query in keyword.lower() for keyword in pub.get("keywords", []))

        if titulo_match or resumen_match or keywords_match:
            results.append(pub)
            
    return results