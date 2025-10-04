import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductScreen from "../screens/ProductScreen";
import { ProductScreenSkeleton } from "../components/Skeletons";
import { useProduct } from "../hooks/useProduct";

const ProductScreenWrapper: React.FC = () => {
  const { placeName, productName } = useParams();
  const navigate = useNavigate();

  const { product, loading } = useProduct(placeName || "", productName || "");
  
  if (!product || loading || !placeName || !productName) return <ProductScreenSkeleton />;

  return (
    <ProductScreen
      product={product}
      placeName={placeName}
      onProceedToPayment={(product, quantity) => {
        navigate(`/${placeName}/${productName}/payment`, {
          state: { order: { product, quantity }, placeName: placeName  },
        });
      }}
      onBack={() => navigate(`/${placeName}`)}
    />
  );
};

export default ProductScreenWrapper;
