'use client';

import React, { createContext, useContext, useState } from 'react';

type AppContextType = {
  homeIndex: number;
  setHomeIndex: React.Dispatch<React.SetStateAction<number>>;
};

const AppContext = createContext<AppContextType>({
  homeIndex: 0,
  setHomeIndex: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [homeIndex, setHomeIndex] = useState(0);

  return (
    <AppContext.Provider value={{ homeIndex, setHomeIndex }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
