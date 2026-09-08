import { Stack } from 'expo-router';

import { AlbunsProvider } from '@/contexts/albuns-context';

export default function RootLayout() {
  return (
    <AlbunsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="criar-conta" />
        <Stack.Screen name="home" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="criar-album" options={{ presentation: 'modal' }} />
      </Stack>
    </AlbunsProvider>
  );
}
