import React, { createContext, useContext, useMemo, useState } from 'react';
const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [toast, setToast] = useState(null);
  const notify = (message, type='success') => { setToast({ message, type }); window.setTimeout(() => setToast(null), 3500); };
  const value = useMemo(() => ({ toast, notify, clearToast: () => setToast(null) }), [toast]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useAppContext = () => useContext(AppContext);
export default useAppContext;
