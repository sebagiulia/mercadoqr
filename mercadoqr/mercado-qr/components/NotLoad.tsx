import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from './Header';

export const PaymentNotLoadScreen :React.FC = () => {
    
    const navigate = useNavigate();
    return (

        <div className="flex flex-col h-screen bg-mercado-light-gray">
      <Header title="Confirmar Pago" onBack={() => navigate("/")} />
                <div style={{ padding: '20px', textAlign: 'center' }}>
      
          <h2>Error</h2>
          <p>No se pudo cargar la información del pedido. Por favor, regresa e intenta nuevamente.</p>
          <div>
              <button 
                  onClick={() => navigate("/")} 
                  style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#007bff', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer' 
                  }}>
                  Regresar
              </button>
          </div>
      </div>
          </div>
)
}