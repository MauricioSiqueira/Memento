import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';

import { FolhaAcoes } from '@/components/ui/FolhaAcoes';
import { criarOpcoesNovoAlbum } from '@/utils/opcoes-criar-album';

type NomeIcone = keyof typeof Ionicons.glyphMap;

/**
 * expo-router não expõe publicamente o tipo `BottomTabBarProps` do bottom-tabs que ele
 * vendoriza internamente (só o componente `Tabs` é re-exportado). Declaramos aqui só o
 * subconjunto de campos que este componente realmente usa; o objeto real que o
 * `tabBar={(props) => <FluidGlass {...props} />}` injeta é estruturalmente compatível.
 */
interface FluidGlassProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    // A assinatura real do bottom-tabs é genérica sobre um mapa de eventos que o
    // expo-router não exporta publicamente; `any` aqui evita depender desse tipo interno
    // enquanto mantém o restante de `FluidGlassProps` (o que este componente realmente lê) tipado.
    emit(evento: any): any;
    navigate(nomeRota: string): void;
  };
  insets: { bottom: number };
}

const ICONES_POR_ROTA: Record<string, { ativo: NomeIcone; inativo: NomeIcone }> = {
  index: { ativo: 'images', inativo: 'images-outline' },
  favoritos: { ativo: 'star', inativo: 'star-outline' },
  perfil: { ativo: 'person-circle', inativo: 'person-circle-outline' },
};

const ROTA_CRIAR_ALBUM = 'criar';
const COR_ATIVA = '#4A3A35';
const COR_INATIVA = '#B0A6A4';
const COR_DESTAQUE = '#F29CBA';

/** Barra de navegação inferior flutuante com efeito de vidro líquido (iOS 26+, com fallback nas demais plataformas). */
export default function FluidGlass({ state, navigation, insets }: FluidGlassProps) {
  const vidroNativoDisponivel = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const [folhaCriarVisivel, setFolhaCriarVisivel] = useState(false);
  const opcoesCriarAlbum = useMemo(() => criarOpcoesNovoAlbum(), []);

  return (
    <View style={[estilos.wrapper, { paddingBottom: insets.bottom || 12 }]} pointerEvents="box-none">
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[estilos.barra, !vidroNativoDisponivel && estilos.barraComFallback]}
      >
        {state.routes.map((route, index) => {
          const emFoco = state.index === index;
          const ehBotaoCriarAlbum = route.name === ROTA_CRIAR_ALBUM;

          if (ehBotaoCriarAlbum) {
            return (
              <Pressable
                key={route.key}
                onPress={() => setFolhaCriarVisivel(true)}
                hitSlop={8}
                style={estilos.item}
              >
                <View style={estilos.botaoCriar}>
                  <Ionicons name="add" size={26} color="#FFFFFF" />
                </View>
              </Pressable>
            );
          }

          const aoPressionar = () => {
            const evento = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!emFoco && !evento.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const icones = ICONES_POR_ROTA[route.name] ?? ICONES_POR_ROTA.index;

          return (
            <Pressable key={route.key} onPress={aoPressionar} hitSlop={8} style={estilos.item}>
              <Ionicons
                name={emFoco ? icones.ativo : icones.inativo}
                size={24}
                color={emFoco ? COR_ATIVA : COR_INATIVA}
              />
            </Pressable>
          );
        })}
      </GlassView>

      <FolhaAcoes
        visivel={folhaCriarVisivel}
        titulo="Novo álbum"
        alturaFracao={0.25}
        opcoes={opcoesCriarAlbum}
        aoFechar={() => setFolhaCriarVisivel(false)}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '88%',
    maxWidth: 360,
    height: 64,
    paddingHorizontal: 16,
    borderRadius: 32,
  },
  barraComFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#EFEAE7',
    shadowColor: '#4A3A35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  botaoCriar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COR_DESTAQUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
