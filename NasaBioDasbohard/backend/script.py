# script.py (versión con IA para extraer palabras clave)
import csv
import json
import requests
import re
import time
from bs4 import BeautifulSoup
import spacy # <-- NUEVO: Importamos spaCy
from collections import Counter

# --- NUEVO: Cargar el modelo de lenguaje de spaCy ---
print("Cargando modelo de lenguaje de IA...")
nlp = spacy.load("en_core_web_sm")
print("Modelo cargado.")

def get_abstract(url):
    # (Esta función no cambia, la dejamos como estaba)
    try:
        headers = { 'User-Agent': 'Mozilla/5.0 ...' } # Tu user-agent
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'lxml')
        # ... (el resto de la función es idéntico al anterior)
        # --- MÉTODO 1, 2, 3, 4 ... ---
        # (Copia aquí tu función get_abstract robusta que ya funcionó)
        # La copio de nuevo por si acaso:
        abstract_text = ""
        # MÉTODO 1
        abstract_element = soup.find('section', attrs={'data-ga-action': 'Abstract'})
        if abstract_element:
            p_tag = abstract_element.find('p')
            abstract_text = p_tag.get_text(strip=True) if p_tag else abstract_element.get_text(strip=True)
        # MÉTODO 2
        if not abstract_text:
            abstract_element = soup.find('div', class_='abstract-content')
            if abstract_element: abstract_text = abstract_element.get_text(strip=True)
        # MÉTODO 3
        if not abstract_text:
            abstract_element = soup.find('div', id=re.compile(r'abstract', re.I))
            if abstract_element: abstract_text = abstract_element.get_text(strip=True)
        # MÉTODO 4
        if not abstract_text:
            abstract_heading = soup.find(['h2', 'h3'], string=re.compile(r'Abstract', re.I))
            if abstract_heading:
                next_sibling = abstract_heading.find_next_sibling()
                if next_sibling: abstract_text = next_sibling.get_text(strip=True)
        
        return abstract_text if abstract_text else "Resumen no disponible."
    except Exception:
        return "Error al procesar el resumen."


# --- NUEVO: Función para extraer palabras clave con IA ---
def extract_keywords(text, num_keywords=5):
    """
    Analiza un texto y devuelve las palabras clave más importantes.
    """
    if not text or text in ["Resumen no disponible.", "No se pudo acceder a la página."]:
        return []
    
    # Procesar el texto con spaCy
    doc = nlp(text)
    
    # Filtrar tokens: solo sustantivos y nombres propios, no stop words, no puntuación
    keywords = [
        token.lemma_.lower() for token in doc 
        if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop and not token.is_punct
    ]
    
    # Contar las palabras más comunes y devolver las 'num_keywords' principales
    most_common = [word for word, count in Counter(keywords).most_common(num_keywords)]
    return most_common

# --- El resto del script, con una pequeña modificación ---

csv_url = "https://raw.githubusercontent.com/jgalazka/SB_publications/main/SB_publication_PMC.csv"
# ... (código de descarga del CSV sin cambios) ...
lines = requests.get(csv_url).text.splitlines()
reader = csv.DictReader([line for line in lines if line.strip()], delimiter="\t" if "\t" in lines[0] else ",")

publications = []
print("Procesando publicaciones, extrayendo resúmenes y generando palabras clave con IA...")
for i, row in enumerate(reader, start=1):
    # ... (código para obtener título y link sin cambios) ...
    first_col = list(row.values())[0].strip()
    link = row.get("Link", "").strip()
    if not link:
        match = re.search(r'https?://\S+', first_col)
        if match: link = match.group(0)
    titulo = first_col.replace(link, '').strip() if link else first_col

    abstract = ""
    if link:
        print(f"Procesando ID {i}/{len(lines)-1}...", end='\r')
        abstract = get_abstract(link)
        time.sleep(1) 

    # --- NUEVO: Llamamos a la función de IA ---
    keywords = extract_keywords(abstract)

    publications.append({
        "id": i,
        "titulo": titulo if titulo else "Sin título",
        "link": link,
        "resumen": abstract,
        "keywords": keywords # <-- NUEVO: Añadimos las palabras clave
    })

# ... (código para guardar el JSON sin cambios) ...
output_filename = "publications.json"
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(publications, f, ensure_ascii=False, indent=4)

print(f"\n¡Proceso completado con IA! Se han guardado {len(publications)} publicaciones en '{output_filename}'.")