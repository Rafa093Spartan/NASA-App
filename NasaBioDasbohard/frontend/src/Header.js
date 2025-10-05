// src/Header.js

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white sticky top-0 z-20 border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        {/* Este enlace ahora lleva al inicio */}
        <Link to="/" className="font-extrabold text-xl tracking-tight text-slate-900">
          BioFinder
        </Link>
        <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-slate-600">
          {/* Este enlace ahora lleva a la página de explorar */}
          <Link to="/explorar" className="hover:text-slate-900 transition-colors duration-200">
            Explorar
          </Link>
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Tendencias</a>
          <a href="#" className="hover:text-slate-900 transition-colors duration-200">Recursos</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;