// PublicationList.js (versión con alineación corregida)

function PublicationList({ publications }) {
  if (!publications.length) {
    return <p className="text-center text-gray-600">No se encontraron publicaciones.</p>;
  }

  const colors = ['bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 'bg-purple-200 text-purple-800', 'bg-yellow-200 text-yellow-800'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub) => (
        <div
          key={pub.id}
          className="p-4 border rounded shadow bg-white hover:shadow-lg transition flex flex-col"
        >
          {/* Título */}
          <h2 className="font-bold text-lg mb-2">{pub.titulo}</h2>
          
          {/* --- CORRECCIÓN AQUÍ: Contenedor que crece --- */}
          <div className="flex-grow">
            {/* Resumen */}
            <p className="text-gray-600 text-sm mb-4">
              {pub.resumen && pub.resumen.length > 150 
                ? `${pub.resumen.substring(0, 150)}...` 
                : pub.resumen}
            </p>

            {/* Keywords */}
            <div className="mb-4">
              {pub.keywords && pub.keywords.map((keyword, index) => (
                <span 
                  key={keyword} 
                  className={`text-xs font-semibold mr-2 mb-2 inline-block px-2.5 py-0.5 rounded ${colors[index % colors.length]}`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Link (se empuja al fondo gracias a mt-auto) */}
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-auto pt-2"
            >
              Ver publicación
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default PublicationList;