import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MetricData } from '@/utils/mockData';

interface DataContextType {
  mode: 'demo' | 'real';
  setMode: (mode: 'demo' | 'real') => void;
  realData: { [key: string]: MetricData[] } | null;
  setRealData: (data: { [key: string]: MetricData[] } | null) => void;
  hasUploadedData: boolean;
  setHasUploadedData: (hasData: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'demo' | 'real'>('demo');
  const [realData, setRealData] = useState<{ [key: string]: MetricData[] } | null>(null);
  const [hasUploadedData, setHasUploadedData] = useState(false);

  const value: DataContextType = {
    mode,
    setMode,
    realData,
    setRealData,
    hasUploadedData,
    setHasUploadedData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};