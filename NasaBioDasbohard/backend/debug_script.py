import requests

URL = "https://taskbook.nasaprs.com/tbp/search_results_nscres.cfm?search_year=2024"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print(f"Intentando acceder a: {URL}")

try:
    response = requests.get(URL, headers=HEADERS, timeout=15)
    response.raise_for_status() # Lanza un error si la petición falla

    # Guarda el contenido HTML completo en un archivo
    with open("debug_output.html", "w", encoding='utf-8') as f:
        f.write(response.text)

    print("\n¡Éxito!")
    print("Se ha creado un archivo llamado 'debug_output.html' en tu carpeta 'backend'.")
    print("Por favor, abre ese archivo con tu navegador (Chrome, Edge, etc.) para ver qué contiene.")

except Exception as e:
    print(f"\nOcurrió un error al intentar acceder a la página: {e}")