import { useMemo, useState } from 'react';

import { FolhaAcoes } from '@/components/ui/FolhaAcoes';
import { AlbumListScreen } from '@/features/albums/components/AlbumListScreen';
import { useAlbuns } from '@/features/albums/context/albuns-context';
import { criarOpcoesNovoAlbum } from '@/utils/opcoes-criar-album';

export default function TelaAlbuns() {
  const { albuns, alternarFavorito } = useAlbuns();
  const [folhaVisivel, setFolhaVisivel] = useState(false);
  const opcoesCriarAlbum = useMemo(() => criarOpcoesNovoAlbum(), []);

  return (
    <>
      <AlbumListScreen
        title="Seus álbuns"
        albums={albuns}
        onToggleFavorite={alternarFavorito}
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
