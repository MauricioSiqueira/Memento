import { AlbumListScreen } from '@/features/albums/components/AlbumListScreen';
import { useAlbuns } from '@/features/albums/context/albuns-context';
import { useAlternarFavorito } from '@/features/albums/hooks/use-alternar-favorito';

export default function TelaFavoritos() {
  const { favoritos, carregando, erro, recarregar } = useAlbuns();
  const alternarFavorito = useAlternarFavorito();

  return (
    <AlbumListScreen
      title="Álbuns favoritos"
      albums={favoritos}
      onToggleFavorite={alternarFavorito}
      error={erro}
      refreshing={carregando}
      onRefresh={recarregar}
      emptyMessage="Você ainda não favoritou nenhum álbum. Toque na estrela de um álbum para vê-lo aqui."
    />
  );
}
