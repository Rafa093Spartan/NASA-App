// NasabioDasbohard/frontend/src/components/KnowledgeCloud.js (Versión final)

import React from 'react';

function KnowledgeCloud() {
  const imageUrl = "http://localhost:8000/wordcloud-image";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '424px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="text-xl font-bold mb-4 text-center">Temas Frecuentes</h2>
      <img 
        src={imageUrl} 
        alt="Nube de palabras de temas de investigación" 
        style={{ width: '100%', height: 'auto' }} 
      />
    </div>
  );
}

export default KnowledgeCloud;