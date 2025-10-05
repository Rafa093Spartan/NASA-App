import React, { useState } from 'react';
import { summarizeText, sendChatMessage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

// Variantes de animación para la lista de tarjetas
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


function PublicationCard({ pub, variants }) {
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
      
      // LÍNEA DE DEPURACIÓN CLAVE: Muestra lo que la API devuelve.
      console.log('Respuesta de la API:', response.data); 
      
      // Asegúrate de que response.data.summary exista y no sea null o undefined.
      setSummary(response.data.summary);

    } catch (err) {
      setError("No se pudo generar el resumen.");
      // LÍNEA DE DEPURACIÓN CLAVE: Muestra si hubo un error en la llamada.
      console.error('Error en la llamada API:', err);
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
    <motion.div variants={variants} className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-full transition-all duration-300 hover:border-gray-300">
      
      <div className="flex-grow mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{pub.titulo}</h2>
        <p className="text-gray-600 text-sm">
          {pub.resumen ? (isExpanded ? pub.resumen : `${pub.resumen.substring(0, 250)}...`) : "Resumen no disponible."}
        </p>
        {pub.resumen && pub.resumen.length > 250 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 focus:outline-none">
            {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Resumen por IA</h3>
              <p className="text-sm text-gray-600 mb-4">{summary}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Pregúntale al documento</h4>
              <div className="space-y-3 mb-3 max-h-48 overflow-y-auto pr-2 text-sm">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <p className={`max-w-xs md:max-w-sm px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {msg.parts.join(" ")}
                    </p>
                  </div>
                ))}
                {isChatLoading && <p className="text-center text-xs text-gray-400">IA está pensando...</p>}
              </div>
              <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={isChatLoading}
                />
                <button type="submit" disabled={isChatLoading} className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-md hover:bg-gray-900 disabled:bg-gray-300 transition-colors">
                  Enviar
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-4 flex justify-between items-center">
        <a href={pub.link || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Ver publicación original
        </a>
        {!summary && pub.resumen && (
           <button 
             onClick={handleSummarize}
             disabled={isLoading}
             className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-900 transition disabled:opacity-50 flex-shrink-0"
           >
             {isLoading ? "Generando..." : "Resumir con IA ✨"}
           </button>
        )}
      </div>
    </motion.div>
  );
}


function PublicationList({ publications }) { 
  if (!publications || !publications.length) { 
    return <p className="text-center text-gray-500 mt-8">No se encontraron publicaciones. Intenta con otra búsqueda.</p>; 
  }
  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {publications.map((pub) => (
        <PublicationCard key={pub.id} pub={pub} variants={cardVariants} />
      ))}
    </motion.div>
  );
}



export default PublicationList;