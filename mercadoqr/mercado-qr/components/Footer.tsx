import React from "react";
import { Facebook, Instagram, Globe } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 px-4 text-sm text-gray-600">
      <div className="flex flex-col items-center text-center space-y-2">
        <p className="font-semibold text-gray-700">Mercado QR</p>

        <div className="flex flex-wrap justify-center gap-3 text-mercado-blue font-medium">
          <a href="/" target="_blank" rel="noopener noreferrer">
            App Scanner
          </a>
           |
          <a href="/" target="_blank" rel="noopener noreferrer">
            Panel Admin
          </a>
          |
          <a href="/abrir-negocio" rel="noopener noreferrer">
            Abrí tu negocio
          </a>
        </div>

        <div className="flex gap-4 mt-2 text-gray-500">
          <a href="https://facebook.com/mercadoqr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href="https://instagram.com/mercadoqr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a href="https://mercadoqr.com" target="_blank" rel="noopener noreferrer" aria-label="Sitio Web">
            <Globe size={18} />
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} Mercado QR. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
