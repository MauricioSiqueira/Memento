import '@/global.css';

import { Stack } from 'expo-router';
import { View } from 'react-native';

import { PreferencesProvider } from '@/contexts/preferences-context';
import { AlbunsProvider } from '@/features/albums/context/albuns-context';
import { AuthProvider, useAuth } from '@/features/auth/context/auth-context';

function Rotas() {
  const { status } = useAuth();

  // Enquanto a sessão salva é verificada, não mostra nenhuma tela (evita piscar o login).
  if (status === 'carregando') {
    return <View className="flex-1 bg-memento-canvas dark:bg-memento-canvas-dark" />;
  }

  const autenticado = status === 'autenticado';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!autenticado}>
        <Stack.Screen name="index" />
        <Stack.Screen name="criar-conta" />
      </Stack.Protected>

      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="home" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="convite/[token]" />
        <Stack.Screen name="scanner" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="criar-album" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <AlbunsProvider>
          <Rotas />
        </AlbunsProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}
