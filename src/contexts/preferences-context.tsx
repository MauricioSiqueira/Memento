import { colorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface AppPreferences {
  temaEscuro: boolean;
  setTemaEscuro: (ativo: boolean) => void;
  textoMaior: boolean;
  setTextoMaior: (ativo: boolean) => void;
}

const PreferencesContext = createContext<AppPreferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [temaEscuro, setTemaEscuroState] = useState(false);
  const [textoMaior, setTextoMaior] = useState(false);

  const setTemaEscuro = useCallback((ativo: boolean) => {
    setTemaEscuroState(ativo);
    colorScheme.set(ativo ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    colorScheme.set(temaEscuro ? 'dark' : 'light');
  }, [temaEscuro]);

  const value = useMemo(
    () => ({ temaEscuro, setTemaEscuro, textoMaior, setTextoMaior }),
    [temaEscuro, setTemaEscuro, textoMaior]
  );

  return (
    <PreferencesContext.Provider value={value}>
      <StatusBar style={temaEscuro ? 'light' : 'dark'} />
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences deve ser usado dentro de PreferencesProvider.');
  }
  return context;
}
