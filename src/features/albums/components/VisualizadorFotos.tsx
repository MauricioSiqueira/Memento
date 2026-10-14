import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

interface VisualizadorFotosProps {
  visivel: boolean;
  fotos: string[];
  indiceInicial: number;
  aoFechar: () => void;
}

/** Visualizador de fotos em tela cheia, com deslize horizontal entre as fotos do álbum. */
export function VisualizadorFotos({ visivel, fotos, indiceInicial, aoFechar }: VisualizadorFotosProps) {
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
            keyExtractor={(uri, indice) => `${uri}-${indice}`}
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
              <Image
                source={item}
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

        <View className="absolute self-center" style={{ top: topoSeguro + 20 }}>
          <Text className="text-sm font-semibold text-white">
            {indiceAtual + 1} / {fotos.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

