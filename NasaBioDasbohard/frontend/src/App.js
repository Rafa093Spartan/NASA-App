import React, { useEffect, useState } from 'react';
import { searchPublications } from "./services/api"; 
import SearchBar from "./components/SearchBar";
import PublicationList from "./components/PublicationList";
import KnowledgeCloud from './components/KnowledgeCloud';
import TopKeywordsChart from './components/TopKeywordsChart';
import ExternalResources from './components/ExternalResources';

function App() {
  // Eliminamos el estado 'allPublications' que no se usaba
  const [displayedPublications, setDisplayedPublications] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true); // Empezamos en 'true'

  // useEffect ahora solo carga las publicaciones una vez al inicio
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

  // La función de búsqueda ahora es más simple
  const handleSearch = async () => {
    setLoading(true);
    try {
      // Si la búsqueda está vacía, searchPublications('') devolverá todo
      const response = await searchPublications(query);
      setDisplayedPublications(response.data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // La búsqueda por palabra clave usa la misma lógica
  const handleKeywordSearch = async (keyword) => {
    setQuery(keyword); // Actualizamos el input
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

  return (
    <div className="min-h-screen p-6 bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">
        NASA Bioscience Knowledge Engine 🚀
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <KnowledgeCloud />
        <TopKeywordsChart />
      </div>
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
      {loading ? (
        <p className="text-center text-lg mt-8">Cargando datos de la NASA...</p>
      ) : (
        <PublicationList 
          publications={displayedPublications} 
          onKeywordClick={handleKeywordSearch}
        />
      )}
      <ExternalResources />
    </div>
  );
}

export default App;