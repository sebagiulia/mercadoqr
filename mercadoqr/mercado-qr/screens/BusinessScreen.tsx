import React, { useMemo, useState, useEffect } from "react";
import Product from "../models/product";
import Place from "../models/place";
import Header from "../components/Header";
import { LocationIcon, SocialIcon } from "../components/Icons";

interface BusinessScreenProps {
  products: Product[];  
  place: Place;
  onSelectProduct: (productName: string) => void;
  onBack: () => void;
}

const ProductCard: React.FC<{ product: Product; onSelect: () => void }> = ({
  product,
  onSelect,
}) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`flex items-center p-3 bg-white rounded-lg shadow-sm transition-all duration-300 ${
        isOutOfStock
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-md cursor-pointer"
      }`}
      onClick={!isOutOfStock ? onSelect : undefined}
    >
      <img
        src={product.img}
        alt={product.name}
        className={`w-20 h-20 object-cover rounded-md ${
          isOutOfStock ? "filter grayscale" : ""
        }`}
      />
      <div className="ml-4 flex-grow">
        <h4 className="font-semibold text-mercado-gray">{product.name}</h4>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>
      <div className="text-right">
        {isOutOfStock ? (
          <span className="font-bold text-red-500 text-sm px-2 py-1 bg-red-100 rounded-full">
            Agotado
          </span>
        ) : (
          <p className="font-bold text-mercado-green text-lg">
            ${product.price.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

const BusinessScreen: React.FC<BusinessScreenProps> = ({
  products,
  place,
  onSelectProduct,
  onBack,
}) => {
  

  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || "Sin categoría";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  const categories = useMemo(
    () => Object.keys(productsByCategory),
    [productsByCategory]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const displayedProducts = useMemo(() => {
    return productsByCategory[selectedCategory] || [];
  }, [selectedCategory, productsByCategory]);

  return (
    <div className="flex flex-col h-full bg-mercado-light-gray">
      <Header title={place.name} onBack={onBack} />
      <div>
        <img
          src={place.img}
          alt={place.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 bg-white">
          <h2 className="text-2xl font-bold text-mercado-gray">{place.name}</h2>
          <p className="text-gray-600 mt-2">{place.description}</p>
          <div className="mt-4 space-y-2 text-gray-700">
            <div className="flex items-center">
              <LocationIcon />
              <span className="ml-2">{place.address}</span>
            </div>
            <div className="flex items-center">
              <SocialIcon />
              <a
                href="#"
                className="ml-2 text-mercado-blue hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-grow p-4">
        <h3 className="text-xl font-bold text-mercado-gray mb-4">Catálogo</h3>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-mercado-blue text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category} ({productsByCategory[category].length})
              </button>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {products.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => onSelectProduct(product.name)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">
              Este negocio aún no tiene productos.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BusinessScreen;
