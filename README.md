# Motor de Conocimiento de Biología Espacial de la NASA 🚀

Este proyecto es un motor de conocimiento para explorar las publicaciones de biología espacial de la NASA, desarrollado para el NASA International Space Apps Challenge.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado el siguiente software en tu sistema:
* [Python 3.8+](https://www.python.org/downloads/)
* [Node.js (LTS)](https://nodejs.org/)
* [Git](https://git-scm.com/downloads)

---

## 🚀 Guía de Instalación y Puesta en Marcha

Sigue estos pasos para tener el proyecto corriendo en tu máquina local.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Rafa093Spartan/NASA-App.git
cd NASA-App
```

### 2. Configurar el Backend (Python)

```bash
# Navega a la carpeta del backend
cd backend

# Crea un entorno virtual
python -m venv venv
-- Si no te deja crear el entorno virtual usa esta linea de comando en la powershell como admin
-- Set-ExecutionPolicy RemoteSigned -- Le das si a todo

# Activa el entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instala las dependencias de Python
pip install -r requirements.txt

# Ejecuta el script para generar los datos (tardará 10-15 mins)
# ¡Este paso solo se hace una vez!
python script.py
```

### 3. Configurar el Frontend (React)

```bash
# Desde la raíz del proyecto, navega a la carpeta del frontend
cd ../frontend

# Instala las dependencias de Node.js
npm install
```

### 4. ¡Iniciar la Aplicación!

Necesitas **dos terminales abiertas** simultáneamente.

* **En la Terminal 1 (Backend):**
    ```bash
    # (Asegúrate de estar en la carpeta 'backend' y con 'venv' activado)
    uvicorn main:app --reload
    ```
* **En la Terminal 2 (Frontend):**
    ```bash
    # (Asegúrate de estar en la carpeta 'frontend')
    npm start
    ```

La aplicación debería abrirse automáticamente en `http://localhost:3000`.

---
## 🤝 Flujo de Trabajo (Workflow)

1.  **Nunca trabajes en la rama `main`**.
2.  Antes de empezar algo nuevo, actualiza tu copia local: `git pull origin main`.
3.  Crea una nueva rama para tu tarea: `git checkout -b nombre-de-tu-rama`.
4.  Cuando termines, sube tus cambios (`git push`) y crea un **Pull Request** en GitHub para que el equipo revise tu código.
