# check_models.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Carga la clave de API desde tu archivo .env
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

print("Buscando modelos de IA disponibles para tu clave...")
print("-------------------------------------------")

# Itera sobre todos los modelos y muestra los que soportan "generateContent"
for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(model.name)

print("-------------------------------------------")
print("Copia uno de los nombres de la lista de arriba y úsalo en main.py")