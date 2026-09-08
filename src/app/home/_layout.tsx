import { Tabs } from 'expo-router';

import FluidGlass from '@/components/navigation/FluidGlass';

export default function LayoutHome() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FluidGlass {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Álbuns' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      {/* O toque nesta aba é tratado inteiramente dentro do FluidGlass (abre o MenuAcoes
          ancorado no próprio botão) e nunca emite um evento de tabPress. */}
      <Tabs.Screen name="criar" options={{ title: 'Criar álbum' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Personalização' }} />
    </Tabs>
  );
}
