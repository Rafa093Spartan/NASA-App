// frontend/src/App.js (versión con dashboard)

import React, { useEffect, useState } from 'react';
import { searchPublications } from "./services/api"; 
import SearchBar from "./components/SearchBar";
import PublicationList from "./components/PublicationList";
import KnowledgeCloud from './components/KnowledgeCloud';
import TopKeywordsChart from './components/TopKeywordsChart'; // <-- 1. Importar

function App() {
  const [allPublications, setAllPublications] = useState([]);
  const [displayedPublications, setDisplayedPublications] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAllPublications = async () => {
      const response = await searchPublications(''); 
      setAllPublications(response.data);
      setDisplayedPublications(response.data);
    };
    loadAllPublications();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setDisplayedPublications(allPublications);
      return;
    }
    setLoading(true);
    const response = await searchPublications(query);
    setDisplayedPublications(response.data);
    setLoading(false);
  };

  const handleKeywordSearch = async (keyword) => {
    setQuery(keyword);
    setLoading(true);
    const response = await searchPublications(keyword);
    setDisplayedPublications(response.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">
        NASA Bioscience Knowledge Engine 🚀
      </h1>

      {/* -- 2. Crear un Grid para el Dashboard -- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <KnowledgeCloud />
          <TopKeywordsChart />
      </div>
      {/* -- Fin del Grid -- */}

      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {loading ? (
        <p className="text-center text-lg mt-8">Buscando en los archivos de la NASA...</p>
      ) : (
        <PublicationList 
          publications={displayedPublications} 
          onKeywordClick={handleKeywordSearch}
        />
      )}
    </div>
  );
}

export default App;