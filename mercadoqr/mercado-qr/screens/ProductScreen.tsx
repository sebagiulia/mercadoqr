import React, { useState } from "react";
import Header from "../components/Header";
import { PlusIcon, MinusIcon, EmailIcon, PhoneIcon } from "../components/Icons";
import Product from "../models/product";

interface ProductScreenProps {
  product: Product;
  placeName: string;
  onProceedToPayment: (product: Product, quantity: number) => void;
  onBack: () => void;
}

const QuantitySelector: React.FC<{
  quantity: number;
  setQuantity: (q: number) => void;
  stock: number;
}> = ({ quantity, setQuantity, stock }) => {
  const increment = () => setQuantity(Math.min(stock, quantity + 1));
  const decrement = () => setQuantity(Math.max(1, quantity - 1));

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={decrement}
        className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
        disabled={quantity <= 1}
      >
        <MinusIcon />
      </button>
      <div className="text-black text-3xl font-bold w-20 h-12 flex items-center justify-center border-2 border-gray-200 rounded-lg bg-white">
        {quantity}
      </div>
      <button
        onClick={increment}
        className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
        disabled={quantity >= stock}
      >
        <PlusIcon />
      </button>
    </div>
  );
};



const ProductScreen: React.FC<ProductScreenProps> = ({
  product,
  placeName,
  onProceedToPayment,
  onBack,
}) => {
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock === 0;

  const ProductDetails = () => (
    <>
        <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-mercado-gray">{product.name}</h2>
            <p className="text-3xl font-bold text-mercado-green">${product.price.toFixed(2)}</p>
        </div>
         {isOutOfStock && (
            <div className="mt-2">
                <span className="font-bold text-red-500 text-sm px-3 py-1 bg-red-100 rounded-full">Agotado</span>
            </div>
        )}
        <p className="text-gray-600 mt-4">{product.description}</p>
        {!isOutOfStock && <p className="text-sm text-gray-500 mt-2">Disponibles: {product.stock}</p>}
    </>
);

  const PaymentForm = () => (
        <>
        {isOutOfStock ? (
            <div className="my-6 text-center text-gray-500 font-semibold">
                Este producto no está disponible.
            </div>
        ) : (
            <div className="my-6">
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
            </div>
        )}
        </>
        );
        

  return (
    <div className="flex flex-col h-screen">
            <Header title={placeName} onBack={onBack} />
            <div className="flex-grow overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start py-8">
                        {/* Image column */}
                        <div className="lg:sticky lg:top-24">
                           <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                                <img 
                                    src={product.img} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Details column (mobile) */}
                        <div className="mt-8 lg:hidden">
                            <ProductDetails />
                        </div>
                        
                        {/* Form and purchase button (mobile) */}
                        <div className="lg:hidden">
                            <PaymentForm />
                        </div>

                        {/* Details, form, and purchase button (desktop) */}
                        <div className="hidden lg:flex lg:flex-col justify-between h-full">
                            <div>
                                <ProductDetails />
                                <PaymentForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                 <div className="flex justify-between items-center mb-4 text-xl">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-mercado-gray">${isOutOfStock ? '0.00' : (product.price * quantity).toFixed(2)}</span>
                </div>
                <button 
                    onClick={() => onProceedToPayment(product, quantity)}
                    disabled={isOutOfStock}
                    className="w-full bg-mercado-blue text-white font-bold py-4 rounded-lg hover:bg-mercado-blue-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isOutOfStock ? 'Producto Agotado' : 'Continuar al Pago'}
                </button>
            </div>
        </div>
  );
};

export default ProductScreen;
