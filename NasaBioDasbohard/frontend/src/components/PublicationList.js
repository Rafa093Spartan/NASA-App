import React, { useState } from 'react';
import { summarizeText, sendChatMessage } from '../services/api';

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
      setChatHistory([...newHistory, { role: 'model', parts: ["Lo siento, ocurrió un error."] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white hover:shadow-lg transition flex flex-col">
      <h2 className="font-bold text-lg mb-2">{pub.titulo}</h2>
      <div className="flex-grow">
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Resumen Técnico:</span>{' '}
            {pub.resumen ? (isExpanded ? pub.resumen : `${pub.resumen.substring(0, 200)}...`) : "No disponible."}
          </p>
          {pub.resumen && pub.resumen.length > 200 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 hover:underline text-sm font-semibold">
              {isExpanded ? 'Leer menos' : 'Leer más'}
            </button>
          )}
        </div>
        {isLoading && <p className="text-center text-blue-600">Generando resumen con IA...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {summary && (
          <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-1">Resumen Ejecutivo (IA):</h3>
            <p className="text-gray-800 text-sm">{summary}</p>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-bold text-gray-700 mb-2">Pregúntale algo a la IA:</h4>
              <div className="space-y-2 mb-2 max-h-48 overflow-y-auto pr-2">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-gray-200 text-right' : 'bg-white'}`}>
                    <p className="text-sm text-left">{msg.parts.join(" ")}</p>
                  </div>
                ))}
                {isChatLoading && <p className="text-sm text-center text-gray-500">IA está pensando...</p>}
              </div>
              <form onSubmit={handleSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-grow border rounded px-2 py-1 text-sm"
                  disabled={isChatLoading}
                />
                <button type="submit" disabled={isChatLoading} className="bg-gray-600 text-white font-semibold py-1 px-3 rounded hover:bg-gray-800 disabled:bg-gray-400">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto pt-2 flex justify-between items-center">
        {pub.link && (
          <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Ver publicación
          </a>
        )}
        {!summary && pub.resumen && (
           <button 
             onClick={handleSummarize}
             disabled={isLoading}
             className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400 flex-shrink-0"
           >
             {isLoading ? "..." : "Resumir ✨"}
           </button>
        )}
      </div>
    </div>
  );
}

function PublicationList({ publications }) { 
  if (!publications || !publications.length) { return <p>...</p>; }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub) => (
        <PublicationCard key={pub.id} pub={pub} />
      ))}
    </div>
  );
}

export default PublicationList;