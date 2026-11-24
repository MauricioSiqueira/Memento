import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { useAlbuns } from '@/features/albums/context/albuns-context';
import { ApiError, mensagemDeErro } from '@/services/api/erros';

/** Destino do link `memento://convite/{token}` quando aberto fora do app (compartilhar/Linking). */
export default function TelaConvite() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { entrarPorLink } = useAlbuns();
  const tentou = useRef(false);

  useEffect(() => {
    if (tentou.current || !token) return;
    tentou.current = true;

    entrarPorLink(token)
      .then((album) => router.replace(`/album/${album.id}`))
      .catch((erro) => {
        const invalido = erro instanceof ApiError && (erro.status === 400 || erro.status === 404);
        Alert.alert(
          invalido ? 'Convite inválido' : 'Não foi possível entrar no álbum',
          invalido ? 'Este convite não existe mais ou foi substituído pelo dono do álbum.' : mensagemDeErro(erro),
          [{ text: 'OK', onPress: () => (router.canGoBack() ? router.back() : router.replace('/home')) }]
        );
      });
  }, [token, entrarPorLink]);

  return (
    <View className="flex-1 items-center justify-center bg-memento-canvas dark:bg-memento-canvas-dark">
      <ActivityIndicator />
    </View>
  );
}
