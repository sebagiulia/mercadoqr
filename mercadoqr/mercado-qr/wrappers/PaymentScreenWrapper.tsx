import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentScreen from "../screens/PaymentScreen";
import { PaymentNotLoadScreen } from "../components/NotLoad";

const PaymentScreenWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { order, placeName } = location.state || {};
  if (!order || !placeName) {
    // Si no hay orden o nombre del lugar, regresar a la pantalla anterior
    
    return <PaymentNotLoadScreen />;
  }
  return (
    <PaymentScreen
      order={order}
      placeName={placeName}
      onBack={() => navigate(-1)}
    />
  );
};

export default PaymentScreenWrapper;
