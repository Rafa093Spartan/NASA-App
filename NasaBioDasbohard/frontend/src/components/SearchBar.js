function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="flex gap-2 mb-6 justify-center">
      <input
        type="text"
        placeholder="Buscar publicaciones..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
