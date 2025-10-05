import React, { useEffect, useState } from 'react';
import { searchPublications } from "./services/api";
import SearchBar from "./components/SearchBar";
import PublicationList from "./components/PublicationList";
import ExternalResources from './components/ExternalResources';

// Se eliminan los imports de componentes que no se usarán en la vista principal
// import KnowledgeCloud from './components/KnowledgeCloud';
// import TopKeywordsChart from './components/TopKeywordsChart';
// import ExternalResources from './components/ExternalResources';

function App() {
  const [displayedPublications, setDisplayedPublications] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Toda tu lógica de carga y búsqueda permanece intacta ---
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
      const response = await searchPublications(query);
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
      const response = await searchPublications(keyword);
      setDisplayedPublications(response.data);
    } catch (error) {
      console.error("Error en la búsqueda por keyword:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Aquí comienza el rediseño visual ---
  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-2">
          BioFinder
        </h1>
        
        <p className="text-gray-500 text-center text-lg mb-12">
          Un motor de búsqueda para publicaciones científicas.
        </p>
        
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          onSearch={handleSearch} 
        />
        
        <div className="mt-12">
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Buscando publicaciones...</p>
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