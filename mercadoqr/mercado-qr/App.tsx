import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreenWrapper from "./wrappers/HomeScreenWrapper";
import BusinessScreenWrapper from "./wrappers/BusinessScreenWrapper";
import ProductScreenWrapper from "./wrappers/ProductScreenWrapper";
import PaymentScreenWrapper from "./wrappers/PaymentScreenWrapper";
import CreateScreenWrapper from "./wrappers/CreateScreenWrapper";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Router>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeScreenWrapper />} />
            <Route path="/:placeName" element={<BusinessScreenWrapper />} />
            <Route path="/:placeName/:productName" element={<ProductScreenWrapper />} />
            <Route path="/:placeName/:productName/payment" element={<PaymentScreenWrapper />} />
            <Route path="/abrir-negocio" element={<CreateScreenWrapper />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
