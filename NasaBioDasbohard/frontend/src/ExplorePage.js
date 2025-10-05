// src/ExplorePage.js

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicationList from './components/PublicationList';
import ExternalResources from './components/ExternalResources';
import SearchBar from './components/SearchBar';
import { searchPublications, searchPublicationsAI } from './services/api'; 

// === FUNCIÓN DE UTILIDAD PARA LIMPIAR LA CONSULTA ===
const cleanQueryString = (rawQuery) => {
    let cleanQuery = rawQuery.toLowerCase().trim();
    
    const conversationalPhrases = [
        "can you give me", 
        "give me just", 
        "articles about", 
        "sobre el tema de",
        "dame informacion de",
        "i want to see",
        "i want to know"
    ];

    // 1. Eliminar frases conversacionales
    conversationalPhrases.forEach(phrase => {
        // Usamos RegExp para reemplazar la palabra completa (\\b)
        cleanQuery = cleanQuery.replace(new RegExp('\\b' + phrase + '\\b', 'g'), '').trim();
    });

    // 2. Eliminar números sueltos (como "10")
    cleanQuery = cleanQuery.replace(/\b\d+\b/g, '').trim(); 

    // 3. Limpiar múltiples espacios en blanco
    return cleanQuery.replace(/\s\s+/g, ' ').trim();
};

// === INICIO DEL COMPONENTE ExplorePage ===
export default function ExplorePage() {
    // ... (El resto del código de estados es el mismo)
    const [publications, setPublications] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showResources, setShowResources] = useState(true);
    const [query, setQuery] = useState(searchParams.get('q') || '');

    // ... (El resto del código de fetchData es el mismo)
    const fetchData = useCallback(async (currentQuery) => {
        setLoading(true);
        try {
            let response = await searchPublications(currentQuery);
            
            if (response.data.length === 0 && currentQuery) {
                console.log("No exact results found. Falling back to AI search...");
                response = await searchPublicationsAI(currentQuery);
            }
            
            setPublications(response.data); 
            
        } catch (error) {
            console.error("Error loading publications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const currentQuery = searchParams.get('q') || '';
        setQuery(currentQuery);

        const hasQuery = !!currentQuery;
        setShowResources(!hasQuery);
        
        // Ejecuta la búsqueda. Nota: El query que llega aquí ya debe estar limpio si viene de handleSearch/handleKeywordSearch
        fetchData(currentQuery);
    }, [searchParams, fetchData]);

    // === HANDLER DE BÚSQUEDA MODIFICADO ===
const handleSearch = () => {
    // ⬅️ ¡Aquí es donde se limpia la consulta antes de buscar!
    const cleanQuery = cleanQueryString(query);
    
    // Actualiza la URL con la consulta limpia. Esto dispara el useEffect.
    setSearchParams({ q: cleanQuery });
};
    
    // === HANDLER DE PALABRA CLAVE MODIFICADO ===
const handleKeywordSearch = (keyword) => {
    // También limpiamos las keywords por si acaso.
    const cleanKeyword = cleanQueryString(keyword);
    
    // Establece el nuevo query y actualiza la URL.
    setQuery(cleanKeyword);
    setSearchParams({ q: cleanKeyword });
};
    
    // ... (El resto del return del componente es el mismo)
    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-center mb-4">
                Explore Publications
            </h1>
            
            <div className="max-w-2xl mx-auto mb-8">
                <SearchBar 
                    query={query} 
                    setQuery={setQuery} 
                    onSearch={handleSearch} 
                />
            </div>

            {showResources && <ExternalResources />}

            <div className="mt-8">
                {loading ? (
                    <p className="text-center text-slate-400 animate-pulse">Searching...</p>
                ) : (
                    <>
                        {publications.length > 0 && (
                            <h2 className="text-xl font-semibold mb-4">
                                {searchParams.get('q') ? `Results for "${searchParams.get('q')}"` : "Recent Publications"}
                            </h2>
                        )}
                        
                        <PublicationList 
                            publications={publications} 
                            onKeywordClick={handleKeywordSearch} 
                        />
                        
                        {publications.length === 0 && searchParams.get('q') && (
                            <p className="text-center text-slate-500">
                                No publications found for "{searchParams.get('q')}". Try a different search.
                            </p>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}