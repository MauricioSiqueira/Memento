import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useAlbuns } from '@/features/albums/context/albuns-context';
import { mensagemDeErro } from '@/services/api/erros';

/** `alternarFavorito` que avisa o usuário se a API recusar (a estrela já volta ao estado anterior). */
export function useAlternarFavorito() {
  const { alternarFavorito } = useAlbuns();

  return useCallback(
    (id: string) => {
      alternarFavorito(id).catch((erro) =>
        Alert.alert('Não foi possível atualizar o favorito', mensagemDeErro(erro))
      );
    },
    [alternarFavorito]
  );
}
