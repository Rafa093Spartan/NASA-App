// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importa los componentes desde sus archivos
import Header from './Header'; // <-- AÑADE ESTA LÍNEA
import HomePage from './HomePage';
import ExplorePage from './ExplorePage';
import ExternalResources from './components/ExternalResources';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen text-slate-900 font-sans">
        {/* 2. Usa el componente Header importado */}
        <Header />

        {/* El resto del código de las rutas se queda igual */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorar" element={<ExplorePage />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;