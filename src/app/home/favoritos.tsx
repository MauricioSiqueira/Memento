import { AlbumListScreen } from '@/features/albums/components/AlbumListScreen';
import { useAlbuns } from '@/features/albums/context/albuns-context';

export default function TelaFavoritos() {
  const { favoritos, alternarFavorito } = useAlbuns();

  return (
    <AlbumListScreen
      title="Álbuns favoritos"
      albums={favoritos}
      onToggleFavorite={alternarFavorito}
      emptyMessage="Você ainda não favoritou nenhum álbum. Toque na estrela de um álbum para vê-lo aqui."
    />
  );
}
