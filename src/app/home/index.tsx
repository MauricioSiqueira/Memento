import { useMemo, useState } from 'react';

import { FolhaAcoes } from '@/components/ui/FolhaAcoes';
import { AlbumListScreen } from '@/features/albums/components/AlbumListScreen';
import { useAlbuns } from '@/features/albums/context/albuns-context';
import { useAlternarFavorito } from '@/features/albums/hooks/use-alternar-favorito';
import { criarOpcoesNovoAlbum } from '@/utils/opcoes-criar-album';

export default function TelaAlbuns() {
  const { albuns, carregando, erro, recarregar } = useAlbuns();
  const alternarFavorito = useAlternarFavorito();
  const [folhaVisivel, setFolhaVisivel] = useState(false);
  const opcoesCriarAlbum = useMemo(() => criarOpcoesNovoAlbum(), []);

  return (
    <>
      <AlbumListScreen
        title="Seus álbuns"
        albums={albuns}
        onToggleFavorite={alternarFavorito}
        emptyMessage="Você ainda não tem álbuns. Toque no + para criar um ou entrar em um álbum compartilhado."
        error={erro}
        refreshing={carregando}
        onRefresh={recarregar}
        onAddAlbum={() => setFolhaVisivel(true)}
      />
      <FolhaAcoes
        visivel={folhaVisivel}
        titulo="Novo álbum"
        alturaFracao={0.25}
        opcoes={opcoesCriarAlbum}
        aoFechar={() => setFolhaVisivel(false)}
      />
    </>
  );
}
