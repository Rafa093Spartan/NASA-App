import json
import requests
from bs4 import BeautifulSoup
import time
import os
from tqdm import tqdm

BASE_URL = "https://taskbook.nasaprs.com/tbp/"
OUTPUT_FILE = 'taskbook_data.json'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def get_project_details(project_url):
    for attempt in range(3):
        try:
            response = requests.get(project_url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            details = {}

            title_tag = soup.find('h2')
            details['project_title'] = title_tag.get_text(strip=True) if title_tag else "Título no encontrado"

            pi_header = soup.find('strong', string=lambda t: t and 'Principal Investigator:' in t)
            if pi_header and pi_header.next_sibling and isinstance(pi_header.next_sibling, str):
                details['principal_investigator'] = pi_header.next_sibling.strip()
            else:
                details['principal_investigator'] = "No disponible"
            
            benefits_header = soup.find('h4', string=lambda t: t and 'Earth-Benefits' in t)
            if benefits_header and benefits_header.find_next_sibling('p'):
                details['earth_benefits'] = benefits_header.find_next_sibling('p').get_text(strip=True)
            else:
                details['earth_benefits'] = "No disponible"
                
            details['source_link'] = project_url
            return details
        except requests.exceptions.RequestException as e:
            print(f"  -- Intento {attempt+1}/3 fallido para {project_url}: {e}. Reintentando en 3 segundos...")
            time.sleep(3)
    return None

# --- SCRIPT PRINCIPAL ---

all_projects = []
processed_urls = set()
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        all_projects = json.load(f)
        processed_urls = {project.get('source_link') for project in all_projects}
    print(f"Archivo existente encontrado. Reanudando. {len(all_projects)} proyectos ya procesados.")

project_urls_to_fetch = set()
print("Buscando la lista de todos los proyectos de los últimos años...")
# Usamos un rango de años más amplio para asegurar que encontremos datos
for year in range(2018, 2026): 
    print(f"\nBuscando en el año {year}...")
    search_url = f"{BASE_URL}search_results_nscres.cfm?search_year={year}"
    try:
        response = requests.get(search_url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # --- CAMBIO CLAVE: MÉTODO DE BÚSQUEDA MÁS ROBUSTO ---
        # 1. Encontrar todos los links de la página.
        all_links = soup.find_all('a')
        found_count = 0
        # 2. Filtrar solo los que nos interesan.
        for link in all_links:
            href = link.get('href')
            if href and 'task_details.cfm?task_id=' in href:
                full_url = f"{BASE_URL}{href}"
                if full_url not in processed_urls:
                    project_urls_to_fetch.add(full_url)
                    found_count += 1
        
        if found_count > 0:
            print(f"  -- Se encontraron {found_count} proyectos nuevos.")
        else:
            print("  -- No se encontraron proyectos nuevos para este año.")
            
        time.sleep(1)

    except Exception as e:
        print(f"  -- No se pudo obtener la lista de proyectos para el año {year}: {e}")

project_list = list(project_urls_to_fetch)
if not project_list:
    print("\nNo hay proyectos nuevos que procesar. ¡Todo está actualizado!")
else:
    print(f"\nSe encontraron {len(project_list)} proyectos nuevos en total para procesar.")

    for i, url in enumerate(tqdm(project_list, desc="Procesando Proyectos")):
        details = get_project_details(url)
        if details:
            all_projects.append(details)
            processed_urls.add(url)
        
        if (i + 1) % 10 == 0:
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(all_projects, f, ensure_ascii=False, indent=2)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(all_projects, f, ensure_ascii=False, indent=2)

print("\n¡Proceso completado!")
print(f"El archivo '{OUTPUT_FILE}' ahora contiene un total de {len(all_projects)} proyectos.")