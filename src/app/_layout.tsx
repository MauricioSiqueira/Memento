import '@/global.css';

import { Stack } from 'expo-router';

import { AccessibilityProvider } from '@/contexts/accessibility-context';
import { AlbunsProvider } from '@/features/albums/context/albuns-context';

export default function RootLayout() {
  return (
    <AlbunsProvider>
      <AccessibilityProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="criar-conta" />
          <Stack.Screen name="home" />
          <Stack.Screen name="album/[id]" />
          <Stack.Screen name="criar-album" options={{ presentation: 'modal' }} />
        </Stack>
      </AccessibilityProvider>
    </AlbunsProvider>
  );
}
