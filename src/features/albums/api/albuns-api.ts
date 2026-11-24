import { anexarArquivo, type ArquivoLocal } from '@/services/api/anexar-arquivo';
import { requisitar, requisitarJson } from '@/services/api/client';
import type { AlbumDetalheDto, AlbumResumoDto, ConviteDto, FotoDto } from '@/services/api/tipos';

/** Limite de `Upload:MaxArquivosPorRequisicao` do backend. */
export const MAXIMO_FOTOS_POR_ENVIO = 10;

export function listarAlbuns(): Promise<AlbumResumoDto[]> {
  return requisitarJson<AlbumResumoDto[]>('/api/albuns');
}

export function obterAlbum(id: string): Promise<AlbumDetalheDto> {
  return requisitarJson<AlbumDetalheDto>(`/api/albuns/${id}`);
}

export function criarAlbum(nome: string): Promise<AlbumDetalheDto> {
  return requisitarJson<AlbumDetalheDto>('/api/albuns', { metodo: 'POST', json: { nome } });
}

export async function definirFavorito(id: string, favorito: boolean): Promise<void> {
  await requisitar(`/api/albuns/${id}/favorito`, { metodo: 'PUT', json: { favorito } });
}

/** Envia no máximo `MAXIMO_FOTOS_POR_ENVIO` fotos por chamada. */
export async function enviarFotos(id: string, arquivos: ArquivoLocal[]): Promise<FotoDto[]> {
  const formulario = new FormData();
  for (const arquivo of arquivos) await anexarArquivo(formulario, 'arquivos', arquivo);
  return requisitarJson<FotoDto[]>(`/api/albuns/${id}/fotos`, { metodo: 'POST', formulario });
}

export async function removerFoto(id: string, arquivoId: string): Promise<void> {
  await requisitar(`/api/albuns/${id}/fotos/${arquivoId}`, { metodo: 'DELETE' });
}

export function obterConvite(id: string): Promise<ConviteDto> {
  return requisitarJson<ConviteDto>(`/api/albuns/${id}/convite`);
}

/** "Escanear QR Code": entra no álbum a partir do texto lido (link de convite). */
export function entrarPorLink(link: string): Promise<AlbumDetalheDto> {
  return requisitarJson<AlbumDetalheDto>('/api/albuns/entrar', { metodo: 'POST', json: { link } });
}
