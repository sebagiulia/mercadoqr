import React, { createContext, useContext, useState } from 'react';

import PlaceService from '@/servicios/placeService';
import PlaceServiceJSONImp from '@/servicios/placeServiceJSONImp';
import PlaceServiceApiImp from '@/servicios/placeServiceApiImp';

import QrService from '@/servicios/qrService';
import qrServiceJSONImp from '@/servicios/qrServiceJSONImp';

interface DependencyContextProps {
  placeService: PlaceService;
  qrService: QrService;
}

const DependencyContext = createContext<DependencyContextProps | undefined>(undefined);

export const DependencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const placeService = new PlaceServiceApiImp();
  const qrService = new qrServiceJSONImp(); 

  return (
    <DependencyContext.Provider value={{ placeService, qrService }}>
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
