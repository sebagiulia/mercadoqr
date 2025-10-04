import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BusinessScreen from "../screens/BusinessScreen";
import { BusinessScreenSkeleton } from "../components/Skeletons";
import { usePlace } from "../hooks/usePlace";

const BusinessScreenWrapper: React.FC = () => {
  const { placeName } = useParams();
  const navigate = useNavigate();

  const { place, products, loading } = usePlace(placeName || "");

  if (!products || loading  || !place) {
    return <BusinessScreenSkeleton />;
  }

  return (
    <BusinessScreen
      products={products}
      place={place}
      onSelectProduct={(productName) => navigate(`/${placeName}/${productName}`)}
      onBack={() => navigate("/")}
    />
  );
};

export default BusinessScreenWrapper;
