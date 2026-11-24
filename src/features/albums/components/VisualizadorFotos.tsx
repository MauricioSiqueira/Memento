import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { ImagemAutenticada } from '@/components/ui/ImagemAutenticada';
import type { Foto } from '@/features/albums/context/albuns-context';

interface VisualizadorFotosProps {
  visivel: boolean;
  fotos: Foto[];
  indiceInicial: number;
  aoFechar: () => void;
  aoRemover: (indice: number) => void;
}

/** Visualizador de fotos em tela cheia, com deslize horizontal entre as fotos do álbum. */
export function VisualizadorFotos({ visivel, fotos, indiceInicial, aoFechar, aoRemover }: VisualizadorFotosProps) {
  const { width: larguraTela, height: alturaTela } = useWindowDimensions();
  const { top: topoSeguro } = useSafeAreaInsets();
  const [indiceAtual, setIndiceAtual] = useState(indiceInicial);

  useEffect(() => {
    if (visivel) setIndiceAtual(indiceInicial);
  }, [visivel, indiceInicial]);

  function aoTerminarDeRolar(evento: NativeSyntheticEvent<NativeScrollEvent>) {
    const indice = Math.round(evento.nativeEvent.contentOffset.x / larguraTela);
    setIndiceAtual(indice);
  }

  return (
    <Modal visible={visivel} animationType="fade" onRequestClose={aoFechar} statusBarTranslucent>
      <View className="flex-1 bg-black">
        {visivel && (
          <FlatList
            data={fotos}
            keyExtractor={(foto) => foto.arquivoId}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={indiceInicial}
            getItemLayout={(_, indice) => ({
              length: larguraTela,
              offset: larguraTela * indice,
              index: indice,
            })}
            onMomentumScrollEnd={aoTerminarDeRolar}
            renderItem={({ item }) => (
              <ImagemAutenticada
                url={item.url}
                style={{ width: larguraTela, height: alturaTela }}
                contentFit="contain"
              />
            )}
          />
        )}

        <Pressable
          className="absolute right-5 h-10 w-10 items-center justify-center rounded-full bg-white/15"
          style={{ top: topoSeguro + 12 }}
          onPress={aoFechar}
          hitSlop={12}
        >
          <Feather name="x" size={24} color="#FFFFFF" />
        </Pressable>

        <Pressable
          className="absolute left-5 h-10 w-10 items-center justify-center rounded-full bg-white/15"
          style={{ top: topoSeguro + 12 }}
          onPress={() => aoRemover(indiceAtual)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Remover esta foto do álbum"
        >
          <Feather name="trash-2" size={20} color="#FFFFFF" />
        </Pressable>

        <View className="absolute self-center" style={{ top: topoSeguro + 20 }}>
          <AccessibleText className="text-sm font-semibold text-white">
            {indiceAtual + 1} / {fotos.length}
          </AccessibleText>
        </View>
      </View>
    </Modal>
  );
}

