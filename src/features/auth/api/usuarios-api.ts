import { requisitarJson } from '@/services/api/client';
import { anexarArquivo, type ArquivoLocal } from '@/services/api/anexar-arquivo';
import type { UsuarioDto } from '@/services/api/tipos';

export function atualizarNomeUsuario(nomeUsuario: string): Promise<UsuarioDto> {
  return requisitarJson<UsuarioDto>('/api/usuarios/me', { metodo: 'PUT', json: { nomeUsuario } });
}

export async function trocarFotoPerfil(arquivo: ArquivoLocal): Promise<UsuarioDto> {
  const formulario = new FormData();
  await anexarArquivo(formulario, 'arquivo', arquivo);
  return requisitarJson<UsuarioDto>('/api/usuarios/me/foto', { metodo: 'PUT', formulario });
}

export function removerFotoPerfil(): Promise<UsuarioDto> {
  return requisitarJson<UsuarioDto>('/api/usuarios/me/foto', { metodo: 'DELETE' });
}
