import React, { useState } from 'react';
import { summarizeText, sendChatMessage } from '../services/api';
import { SparklesIcon } from '@heroicons/react/24/solid';

// --- Componente para cada tarjeta de publicación ---
function PublicationCard({ pub }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSummarize = async () => {
    if (!pub.resumen) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await summarizeText(pub.resumen);
      setSummary(response.data.summary);
    } catch (err) {
      setError("No se pudo generar el resumen.");
      console.error("Error al resumir:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', parts: [userQuestion] }];
    setChatHistory(newHistory);
    setUserQuestion("");
    setIsChatLoading(true);
    try {
      const response = await sendChatMessage(newHistory, userQuestion, pub.resumen);
      const aiResponse = response.data.response;
      setChatHistory([...newHistory, { role: 'model', parts: [aiResponse] }]);
    } catch (err) {
      console.error("Error en el chat:", err);
      setChatHistory([...newHistory, { role: 'model', parts: ["Lo siento, ocurrió un error."] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:border-blue-500 transition-all flex flex-col">
      <h2 className="font-bold text-lg mb-2 text-white">{pub.titulo}</h2>
      
      <div className="flex-grow">
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            <span className="font-semibold text-gray-300">Resumen Técnico:</span>{' '}
            {pub.resumen ? (isExpanded ? pub.resumen : `${pub.resumen.substring(0, 200)}...`) : "No disponible."}
          </p>
          {pub.resumen && pub.resumen.length > 200 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-400 hover:underline text-sm font-semibold">
              {isExpanded ? 'Leer menos' : 'Leer más'}
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {summary && (
          <div className="bg-gray-900 p-3 rounded-md mb-4 border border-blue-900">
            <h3 className="font-bold text-blue-300 mb-1">Resumen Ejecutivo (IA):</h3>
            <p className="text-gray-300 text-sm">{summary}</p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-bold text-gray-400 mb-2">Pregúntale a la IA:</h4>
              <div className="space-y-2 mb-2 max-h-48 overflow-y-auto pr-2">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-gray-600 text-right' : 'bg-gray-700'}`}>
                    <p className="text-left text-gray-200">{msg.parts.join(" ")}</p>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-center items-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-grow bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isChatLoading}
                />
                <button type="submit" disabled={isChatLoading} className="bg-gray-600 text-white font-semibold py-1 px-3 rounded hover:bg-gray-500 disabled:bg-gray-400">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-2 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-4">
          {pub.link && (
            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Ver Publicación 📄
            </a>
          )}
          {pub.osdr_link && (
            <a href={pub.osdr_link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline font-semibold">
              Ver Datos 🔬
            </a>
          )}
        </div>
        
        {!summary && pub.resumen && (
           <button 
             onClick={handleSummarize}
             disabled={isLoading}
             className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-500 transition-colors disabled:bg-gray-500 flex-shrink-0"
           >
             {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (
               <span className="flex items-center gap-2">
                 Resumir <SparklesIcon className="h-5 w-5" />
               </span>
             )}
           </button>
        )}
      </div>
    </div>
  );
}

function PublicationList({ publications }) { 
  if (!publications || !publications.length) {
    return <p className="text-center text-gray-500">No se encontraron publicaciones.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub) => (
        <PublicationCard key={pub.id} pub={pub} />
      ))}
    </div>
  );
}

export default PublicationList;