'use client'
import React, { createContext, useContext } from 'react';

import PlaceService from '@/servicios/placeService';
import PlaceServiceApiImp from '@/servicios/placeServiceApiImp';

import PaymentService from '@/servicios/paymentService';
import PaymentServiceApiImp from '@/servicios/paymentServiceApiImp';

import QrService from '@/servicios/qrService';
import qrServiceApiImp from '@/servicios/qrServiceApiImp';

interface DependencyContextProps {
  placeService: PlaceService;
  qrService: QrService;
  paymentService: PaymentService;
}

const DependencyContext = createContext<DependencyContextProps | undefined>(undefined);

export const DependencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const placeService = new PlaceServiceApiImp();
  const qrService = new qrServiceApiImp();
  const paymentService = new PaymentServiceApiImp(); 

  return (
    <DependencyContext.Provider value={{ placeService, qrService, paymentService }}>
      {children}
    </DependencyContext.Provider>
  );
};

export const useDependencies = (): DependencyContextProps => {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within a DependencyProvider');
  }
  return context;
};

export const placeService = new PlaceServiceApiImp();