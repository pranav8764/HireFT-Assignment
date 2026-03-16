import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({
    urlProcessing: false,
    analysis: false,
    component: null
  });

  const setLoading = (type, isLoading, component = null) => {
    setLoadingStates(prev => ({
      ...prev,
      [type]: isLoading,
      component: isLoading ? component : null
    }));
  };

  const clearLoading = () => {
    setLoadingStates({
      urlProcessing: false,
      analysis: false,
      component: null
    });
  };

  return (
    <LoadingContext.Provider value={{ loadingStates, setLoading, clearLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
