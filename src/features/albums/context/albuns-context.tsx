import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import * as albunsApi from '@/features/albums/api/albuns-api';
import { useAuth } from '@/features/auth/context/auth-context';
import type { ArquivoLocal } from '@/services/api/anexar-arquivo';
import { mensagemDeErro } from '@/services/api/erros';
import type { AlbumDetalheDto, AlbumResumoDto, FotoDto } from '@/services/api/tipos';

export interface Foto {
  arquivoId: string;
  /** Caminho autenticado na API (`/api/arquivos/{id}`); exibir com `ImagemAutenticada`. */
  url: string;
  adicionadoPorId: string;
}

export interface Album {
  id: string;
  nome: string;
  /** `null` enquanto o álbum não tem fotos. */
  capa: string | null;
  favorito: boolean;
  ehDono: boolean;
  totalFotos: number;
  totalMembros: number;
  fotos: Foto[];
  /** `true` depois que o detalhe (com as fotos) foi buscado na API. */
  fotosCarregadas: boolean;
}

interface ResultadoRemocao {
  removidas: number;
  /** Mensagem da primeira falha (ex.: membro tentando remover foto de outra pessoa). */
  erro?: string;
}

interface AlbunsContextValue {
  albuns: Album[];
  favoritos: Album[];
  carregando: boolean;
  /** Mensagem de erro da última listagem, ou `null`. */
  erro: string | null;
  recarregar: () => Promise<void>;
  alternarFavorito: (id: string) => Promise<void>;
  criarAlbum: (nome: string) => Promise<Album>;
  carregarAlbum: (id: string) => Promise<void>;
  adicionarFotos: (id: string, arquivos: ArquivoLocal[]) => Promise<void>;
  removerFotos: (id: string, arquivoIds: string[]) => Promise<ResultadoRemocao>;
  entrarPorLink: (link: string) => Promise<Album>;
  obterLinkConvite: (id: string) => Promise<string>;
}

const AlbunsContext = createContext<AlbunsContextValue | null>(null);

function deFoto(dto: FotoDto): Foto {
  return { arquivoId: dto.arquivoId, url: dto.url, adicionadoPorId: dto.adicionadoPorId };
}

function deResumo(dto: AlbumResumoDto, existente?: Album): Album {
  return {
    id: dto.id,
    nome: dto.nome,
    capa: dto.capaUrl,
    favorito: dto.favorito,
    ehDono: dto.ehDono,
    totalFotos: dto.totalFotos,
    totalMembros: dto.totalMembros,
    fotos: existente?.fotos ?? [],
    fotosCarregadas: existente?.fotosCarregadas ?? false,
  };
}

function deDetalhe(dto: AlbumDetalheDto): Album {
  return {
    id: dto.id,
    nome: dto.nome,
    capa: dto.capaUrl,
    favorito: dto.favorito,
    ehDono: dto.ehDono,
    totalFotos: dto.fotos.length,
    totalMembros: dto.totalMembros,
    fotos: dto.fotos.map(deFoto),
    fotosCarregadas: true,
  };
}

function inserirOuSubstituir(lista: Album[], album: Album): Album[] {
  return lista.some((item) => item.id === album.id)
    ? lista.map((item) => (item.id === album.id ? album : item))
    : [album, ...lista];
}

export function AlbunsProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Descarta respostas de uma conta anterior caso o usuário saia no meio de uma requisição.
  const geracao = useRef(0);

  const recarregar = useCallback(async () => {
    const minhaGeracao = geracao.current;
    setCarregando(true);
    setErro(null);
    try {
      const resumos = await albunsApi.listarAlbuns();
      if (minhaGeracao !== geracao.current) return;
      setAlbuns((atuais) => resumos.map((dto) => deResumo(dto, atuais.find((a) => a.id === dto.id))));
    } catch (e) {
      if (minhaGeracao === geracao.current) setErro(mensagemDeErro(e));
    } finally {
      if (minhaGeracao === geracao.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    geracao.current += 1;
    if (status === 'autenticado') {
      void recarregar();
    } else {
      setAlbuns([]);
      setErro(null);
      setCarregando(false);
    }
  }, [status, recarregar]);

  const alternarFavorito = useCallback(
    async (id: string) => {
      const atual = albuns.find((album) => album.id === id);
      if (!atual) return;
      const novoValor = !atual.favorito;
      const aplicar = (favorito: boolean) =>
        setAlbuns((lista) => lista.map((album) => (album.id === id ? { ...album, favorito } : album)));

      aplicar(novoValor); // otimista: a estrela responde na hora
      try {
        await albunsApi.definirFavorito(id, novoValor);
      } catch (e) {
        aplicar(atual.favorito);
        throw e;
      }
    },
    [albuns]
  );

  const criarAlbum = useCallback(async (nome: string) => {
    const album = deDetalhe(await albunsApi.criarAlbum(nome.trim()));
    setAlbuns((lista) => inserirOuSubstituir(lista, album));
    return album;
  }, []);

  const carregarAlbum = useCallback(async (id: string) => {
    const album = deDetalhe(await albunsApi.obterAlbum(id));
    setAlbuns((lista) => inserirOuSubstituir(lista, album));
  }, []);

  const adicionarFotos = useCallback(
    async (id: string, arquivos: ArquivoLocal[]) => {
      let ultimoErro: unknown = null;
      // O backend aceita um número limitado de arquivos por requisição.
      for (let i = 0; i < arquivos.length; i += albunsApi.MAXIMO_FOTOS_POR_ENVIO) {
        try {
          await albunsApi.enviarFotos(id, arquivos.slice(i, i + albunsApi.MAXIMO_FOTOS_POR_ENVIO));
        } catch (e) {
          ultimoErro = e;
          break;
        }
      }
      // Mesmo com falha parcial, atualiza para mostrar o que já foi enviado.
      await carregarAlbum(id).catch(() => {});
      if (ultimoErro) throw ultimoErro;
    },
    [carregarAlbum]
  );

  const removerFotos = useCallback(
    async (id: string, arquivoIds: string[]): Promise<ResultadoRemocao> => {
      let removidas = 0;
      let primeiroErro: string | undefined;
      for (const arquivoId of arquivoIds) {
        try {
          await albunsApi.removerFoto(id, arquivoId);
          removidas += 1;
        } catch (e) {
          primeiroErro ??= mensagemDeErro(e);
        }
      }
      await carregarAlbum(id).catch(() => {});
      return { removidas, erro: primeiroErro };
    },
    [carregarAlbum]
  );

  const entrarPorLink = useCallback(async (link: string) => {
    const album = deDetalhe(await albunsApi.entrarPorLink(link));
    setAlbuns((lista) => inserirOuSubstituir(lista, album));
    return album;
  }, []);

  const obterLinkConvite = useCallback(async (id: string) => (await albunsApi.obterConvite(id)).link, []);

  const favoritos = useMemo(() => albuns.filter((album) => album.favorito), [albuns]);

  const valor = useMemo(
    () => ({
      albuns,
      favoritos,
      carregando,
      erro,
      recarregar,
      alternarFavorito,
      criarAlbum,
      carregarAlbum,
      adicionarFotos,
      removerFotos,
      entrarPorLink,
      obterLinkConvite,
    }),
    [
      albuns,
      favoritos,
      carregando,
      erro,
      recarregar,
      alternarFavorito,
      criarAlbum,
      carregarAlbum,
      adicionarFotos,
      removerFotos,
      entrarPorLink,
      obterLinkConvite,
    ]
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
