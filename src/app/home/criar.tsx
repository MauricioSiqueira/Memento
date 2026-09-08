import { View } from 'react-native';

/**
 * Rota nunca exibida de fato: o botão desta aba é tratado inteiramente dentro de
 * `FluidGlass` (abre o `MenuAcoes` ancorado nele mesmo) e nunca navega até aqui.
 * O arquivo só existe para registrar a 4ª aba no `Tabs` de `home/_layout.tsx`.
 */
export default function TabCriarAlbumPlaceholder() {
  return <View />;
}
