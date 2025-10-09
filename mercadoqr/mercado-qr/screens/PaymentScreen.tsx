import React, { useState } from "react";
import Order from "../models/order";
import Header from "../components/Header";
import { EmailIcon, PhoneIcon } from "../components/Icons";

interface PaymentScreenProps {
  order: Order;
  placeName: string;
  onBack: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ order, placeName, onBack }) => {
  const { product, quantity } = order;
  const total = product.price * quantity;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const canPay = email.trim() !== "" && email.includes("@") && phone.trim() !== "";

  const handlePayment = () => {
    alert(
      `Iniciando pago de $${total.toFixed(2)} para ${product.name} en ${placeName}.
El QR se enviará a:
- Email: ${email}
- Teléfono: ${phone}`
    );
  };

  return (
    <div className="flex flex-col h-screen bg-mercado-light-gray">
      <Header title="Confirmar Pago" onBack={onBack} />
      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold text-mercado-gray mb-4">Resumen del Pedido</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">
              Comprando en: <span className="font-semibold">{placeName}</span>
            </p>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-mercado-gray">{product.name}</p>
                  <p className="text-sm text-gray-500">Cantidad: {quantity}</p>
                </div>
                <p className="font-semibold text-mercado-gray">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Campos de contacto */}
        <div>
          <h3 className="text-lg font-bold text-mercado-gray mb-2">
            Información de contacto
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Te enviaremos el código QR a tu email y/o whatsapp.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <EmailIcon />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1 block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mercado-blue focus:border-mercado-blue sm:text-sm"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <PhoneIcon />
              </div>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="11 2345 6789"
                className="mt-1 block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mercado-blue focus:border-mercado-blue sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-mercado-gray">Total a pagar</span>
            <span className="text-mercado-green">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="p-4 border-t bg-white">
        <button
          onClick={handlePayment}
          disabled={!canPay}
          className="w-full flex items-center justify-center bg-mercado-blue text-white font-bold py-4 rounded-lg hover:bg-mercado-blue-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <img
            src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
            alt="Mercado Pago"
            className="h-6 w-auto mr-3"
          />
          Pagar con Mercado Pago
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;
