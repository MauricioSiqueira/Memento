import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AccessibilityPreferences {
  textoMaior: boolean;
  setTextoMaior: (ativo: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityPreferences | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [textoMaior, setTextoMaior] = useState(false);
  const value = useMemo(() => ({ textoMaior, setTextoMaior }), [textoMaior]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibilityPreferences() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityPreferences deve ser usado dentro de AccessibilityProvider.');
  }
  return context;
}
