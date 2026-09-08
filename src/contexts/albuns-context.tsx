import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface Album {
  id: string;
  nome: string;
  capa: string;
  favorito: boolean;
  fotos: string[];
}

interface AlbunsContextValue {
  albuns: Album[];
  favoritos: Album[];
  alternarFavorito: (id: string) => void;
  criarAlbum: (nome: string) => void;
}

const AlbunsContext = createContext<AlbunsContextValue | null>(null);

function gerarFotosMock(semente: string, quantidade: number): string[] {
  return Array.from(
    { length: quantidade },
    (_, indice) => `https://picsum.photos/seed/${encodeURIComponent(semente)}-${indice}/600/600`
  );
}

const ALBUNS_INICIAIS: Album[] = [
  {
    id: '1',
    nome: 'Viagem à praia',
    capa: 'https://picsum.photos/seed/praia/400/400',
    favorito: true,
    fotos: gerarFotosMock('praia', 9),
  },
  {
    id: '2',
    nome: 'Aniversário da Ana',
    capa: 'https://picsum.photos/seed/aniversario/400/400',
    favorito: false,
    fotos: gerarFotosMock('aniversario', 6),
  },
  {
    id: '3',
    nome: 'Fim de semana em família',
    capa: 'https://picsum.photos/seed/familia/400/400',
    favorito: false,
    fotos: gerarFotosMock('familia', 5),
  },
  {
    id: '4',
    nome: 'Formatura',
    capa: 'https://picsum.photos/seed/formatura/400/400',
    favorito: true,
    fotos: gerarFotosMock('formatura', 8),
  },
];

export function AlbunsProvider({ children }: { children: React.ReactNode }) {
  const [albuns, setAlbuns] = useState<Album[]>(ALBUNS_INICIAIS);

  const alternarFavorito = useCallback((id: string) => {
    setAlbuns((atuais) =>
      atuais.map((album) => (album.id === id ? { ...album, favorito: !album.favorito } : album))
    );
  }, []);

  const criarAlbum = useCallback((nome: string) => {
    setAlbuns((atuais) => [
      {
        id: String(Date.now()),
        nome,
        capa: `https://picsum.photos/seed/${encodeURIComponent(nome)}/400/400`,
        favorito: false,
        fotos: [],
      },
      ...atuais,
    ]);
  }, []);

  const favoritos = useMemo(() => albuns.filter((album) => album.favorito), [albuns]);

  const valor = useMemo(
    () => ({ albuns, favoritos, alternarFavorito, criarAlbum }),
    [albuns, favoritos, alternarFavorito, criarAlbum]
  );

  return <AlbunsContext.Provider value={valor}>{children}</AlbunsContext.Provider>;
}

export function useAlbuns() {
  const contexto = useContext(AlbunsContext);
  if (!contexto) {
    throw new Error('useAlbuns deve ser usado dentro de um AlbunsProvider.');
  }
  return contexto;
}
