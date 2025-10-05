import React from 'react';

const resources = [
  {
    name: "Open Science Data Repository (OSDR)",
    description: "Accede a los datos crudos y resultados de más de 500 experimentos biológicos realizados en el espacio.",
    link: "https://osdr.nasa.gov/bio/repo/",
  },
  {
    name: "Space Life Sciences Library (NSLSL)",
    description: "Consolida la literatura mundial sobre ciencias espaciales en una única base de datos para apoyar la investigación.",
    link: "https://public.ksc.nasa.gov/nslsl/",
  },
  {
    name: "NASA Task Book",
    description: "Explora proyectos de investigación financiados por la NASA, sus avances, informes y las publicaciones resultantes.",
    link: "https://taskbook.nasaprs.com/tbp/welcome.cfm",
  }
];

function ExternalResources() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">Otros Recursos Oficiales de NASA</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.name} className="border border-gray-300 rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-bold mb-2">{resource.name}</h3>
            <p className="text-gray-600 text-sm flex-grow mb-4">{resource.description}</p>
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-auto bg-gray-700 text-white font-semibold py-2 px-4 rounded text-center hover:bg-gray-900 transition-colors"
            >
              Explorar Recurso
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExternalResources;