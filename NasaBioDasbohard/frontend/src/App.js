import React, { useEffect, useState } from 'react';
import { searchPublications, searchPublicationsAI } from "./services/api"; 
import SearchBar from "./components/SearchBar";
import PublicationList from "./components/PublicationList";
import ExternalResources from './components/ExternalResources';

// --- Componente para la Barra de Navegación ---
const Header = () => {
  return (
    <header className="bg-white sticky top-0 z-20 border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        <div className="font-extrabold text-xl tracking-tight text-slate-900">BioFi</div>
        <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Tendencias</a>
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Opciones</a>
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Explorar</a>
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Recursos</a>
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Contacto</a>
        </div>
      </nav>
    </header>
  );
};

function App() {
  const [displayedPublications, setDisplayedPublications] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialPublications = async () => {
      setLoading(true);
      try {
        const response = await searchPublications('');
        setDisplayedPublications(response.data);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialPublications();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response = await searchPublications(query);

      if (response.data.length === 0) {
        console.log("Nada exacto, buscando con IA...");
        response = await searchPublicationsAI(query);
      }

      setDisplayedPublications(response.data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeywordSearch = async (keyword) => {
    setQuery(keyword);
    setLoading(true);
    try {
      let response = await searchPublications(keyword);

      if (response.data.length === 0) {
        console.log("Nada exacto en keyword, buscando con IA...");
        response = await searchPublicationsAI(keyword);
      }

      setDisplayedPublications(response.data);
    } catch (error) {
      console.error("Error en la búsqueda por keyword:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-197 min-h-screen text-slate-900 font-sans">
      
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        
      <a href="https://sdmntprwestcentralus.oaiusercontent.com/files/00000000-a0f0-61fb-b832-64f0fef427b3/raw?se=2025-10-05T05%3A32%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=9be87cb6-1af2-5cc1-a4fc-5c528026bdf6&skoid=1e4bb9ed-6bb5-424a-a3aa-79f21566e722&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-04T22%3A09%3A51Z&ske=2025-10-05T22%3A09%3A51Z&sks=b&skv=2024-08-04&sig=uCDtzGHxKx77y9I%2Bx1Y9crD9leZ8IrBEYurhFUAbPqQ%3D" target="_blank" rel="noopener noreferrer">
  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-2">
  </h1>
</a>

        
        <p className="text-slate-600 text-center text-lg mb-12">
          Motor de búsqueda para artículos científicos
        </p>
        
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          onSearch={handleSearch} 
        />
        
        <div className="mt-12">
          {loading ? (
            <p className="text-center text-slate-400 animate-pulse">
              Buscando publicaciones...
            </p>
          ) : (
            <PublicationList 
              publications={displayedPublications} 
              onKeywordClick={handleKeywordSearch}
            />
          )}
        </div>

        <ExternalResources />

      </main>
    </div>
  );
}

export default App;
