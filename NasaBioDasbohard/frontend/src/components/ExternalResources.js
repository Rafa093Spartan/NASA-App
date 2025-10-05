import React from 'react';
import { motion } from 'framer-motion';

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

// Variantes de animación para el contenedor y los items
const containerVariants = { 
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Anima cada hijo con 0.1s de diferencia
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Empieza 20px abajo e invisible
  visible: { y: 0, opacity: 1 }, // Termina en su posición y visible
};

function ExternalResources() {
  return (
    <div className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-8">
        Recursos Oficiales
      </h2>
      
      <motion.div 
        className="max-w-2xl mx-auto space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // La animación se activa cuando el componente entra en la pantalla
        viewport={{ once: true, amount: 0.3 }} // Se activa una vez, cuando el 30% es visible
      >
        {resources.map((resource) => (
          <motion.a 
            key={resource.name}
            href={resource.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-5 rounded-lg hover:bg-gray-100 transition-colors group"
            variants={itemVariants} // Cada item de la lista usa las variantes de animación
          >
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {resource.name}
              </h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

export default ExternalResources;