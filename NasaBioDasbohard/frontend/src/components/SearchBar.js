// En tu archivo /components/SearchBar.js

import React from 'react';

const SearchBar = ({ query, setQuery, onSearch }) => {

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Busca por título, autor o palabra clave..."
        className="w-full px-5 py-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <button 
        onClick={onSearch}
        className="absolute top-0 right-0 h-full px-6 text-gray-500 hover:text-blue-600 transition-colors"
        aria-label="Buscar"
      >
        {/* Un ícono SVG de lupa es ideal aquí, pero por simplicidad usamos texto */}
        Buscar
      </button>
    </div>
  );
};

export default SearchBar;