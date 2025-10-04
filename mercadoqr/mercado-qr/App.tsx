import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import HomeScreenWrapper from './wrappers/HomeScreenWrapper';
import BusinessScreenWrapper from './wrappers/BusinessScreenWrapper';
import ProductScreenWrapper from './wrappers/ProductScreenWrapper';
import PaymentScreenWrapper from './wrappers/PaymentScreenWrapper';

const App: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreenWrapper />} />
          <Route path="/:placeName" element={<BusinessScreenWrapper />} />
          <Route path="/:placeName/:productName" element={<ProductScreenWrapper />} />
          <Route path="/:placeName/:productName/payment" element={<PaymentScreenWrapper />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
