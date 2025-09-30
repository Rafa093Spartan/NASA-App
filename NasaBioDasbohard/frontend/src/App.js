import React, { useEffect, useState } from "react";
import { fetchPublications, searchPublications } from "./services/api";
import SearchBar from "./components/SearchBar";
import PublicationList from "./components/PublicationList";

function App() {
  const [publications, setPublications] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    setLoading(true);
    try {
      const response = await fetchPublications();
      setPublications(response.data);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      loadPublications();
      return;
    }
    setLoading(true);
    try {
      const response = await searchPublications(query);
      setPublications(response.data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">
        NASA Bioscience Dashboard 🚀
      </h1>

      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {loading ? (
        <p className="text-center">Cargando publicaciones...</p>
      ) : (
        <PublicationList publications={publications} />
      )}
    </div>
  );
}

export default App;
