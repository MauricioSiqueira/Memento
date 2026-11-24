import { requisitar, requisitarJson } from '@/services/api/client';
import type { CadastroRequest, TokensDto, UsuarioDto } from '@/services/api/tipos';

export function cadastrar(dados: CadastroRequest): Promise<UsuarioDto> {
  return requisitarJson<UsuarioDto>('/api/auth/cadastro', { metodo: 'POST', json: dados, autenticada: false });
}

export function login(email: string, senha: string): Promise<TokensDto> {
  return requisitarJson<TokensDto>('/api/auth/login', {
    metodo: 'POST',
    json: { email, senha },
    autenticada: false,
  });
}

/** Revoga a sessão no servidor. Falhas são ignoradas: o logout local sempre acontece. */
export async function logout(): Promise<void> {
  try {
    await requisitar('/api/auth/logout', { metodo: 'POST' });
  } catch {
    // Sem rede ou sessão já expirada: nada a revogar do nosso lado.
  }
}
