// src/HomePage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar'; // Asegúrate que la ruta sea correcta




export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Cuando se busca, redirige a la página de explorar con la consulta
    if (query.trim()) {
      navigate(`/explorar?q=${query}`);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
      <a href="/">
        <img
          src="/Logo3.png"
          alt="BioFinder Logo"
          className="mx-auto mb-4"
          style={{ height: "80", width: "auto" }}
        />
      </a>
      <p className="text-slate-600 text-lg mb-12">
        Space Biology Knowledge Engine
      </p>
      <SearchBar 
        query={query} 
        setQuery={setQuery} 
        onSearch={handleSearch} 
      />
      <div className="mt-8">
        <Link to="/explorar" className="text-blue-600 hover:underline">
          Or explore the full collection &rarr;
        </Link>
      </div>
    </main>
  );
}