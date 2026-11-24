import { API_URL } from '@/services/api/config';
import { ApiError, erroDaResposta, MENSAGEM_SEM_CONEXAO } from '@/services/api/erros';
import { apagarRefreshToken, lerRefreshToken, salvarRefreshToken } from '@/services/api/token-storage';
import type { TokensDto, UsuarioDto } from '@/services/api/tipos';

/**
 * Sessão em memória + persistência do refresh token.
 *
 * Regras que vêm do backend (ver README da API):
 * - o refresh token é **rotacionado** a cada uso, e reapresentar um já rotacionado derruba a
 *   sessão inteira. Por isso a renovação é de execução única (`renovacaoEmAndamento`) e o novo
 *   token é gravado **antes** de qualquer requisição seguir adiante;
 * - o access token dura 15 min; renovamos com folga antes de expirar.
 */

export interface EstadoSessao {
  accessToken: string | null;
  /** Epoch em ms em que o access token expira. */
  accessTokenExpiraEm: number | null;
  usuario: UsuarioDto | null;
}

type Ouvinte = (estado: EstadoSessao) => void;

const FOLGA_RENOVACAO_MS = 60_000;

let estado: EstadoSessao = { accessToken: null, accessTokenExpiraEm: null, usuario: null };
const ouvintes = new Set<Ouvinte>();
let renovacaoEmAndamento: Promise<boolean> | null = null;

function definirEstado(proximo: EstadoSessao) {
  estado = proximo;
  ouvintes.forEach((ouvinte) => ouvinte(estado));
}

export function obterEstadoSessao(): EstadoSessao {
  return estado;
}

export function assinarSessao(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/** Guarda os tokens recebidos de login/refresh. O refresh token é persistido primeiro. */
async function aplicarTokens(tokens: TokensDto) {
  await salvarRefreshToken(tokens.refreshToken);
  definirEstado({
    accessToken: tokens.accessToken,
    accessTokenExpiraEm: new Date(tokens.accessTokenExpiraEm).getTime(),
    usuario: tokens.usuario,
  });
}

export async function iniciarSessao(tokens: TokensDto) {
  await aplicarTokens(tokens);
}

export function atualizarUsuarioDaSessao(usuario: UsuarioDto) {
  definirEstado({ ...estado, usuario });
}

/** Descarta a sessão neste dispositivo (não avisa o servidor). */
export async function encerrarSessaoLocal() {
  definirEstado({ accessToken: null, accessTokenExpiraEm: null, usuario: null });
  await apagarRefreshToken();
}

async function chamarRefresh(refreshToken: string): Promise<TokensDto> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    throw new ApiError(0, MENSAGEM_SEM_CONEXAO);
  }
  if (!resposta.ok) throw await erroDaResposta(resposta);
  return (await resposta.json()) as TokensDto;
}

/**
 * Troca o refresh token guardado por um novo par de tokens.
 * Devolve `false` quando a sessão não vale mais (o estado local já foi limpo);
 * lança `ApiError` em falhas transitórias (sem rede, 5xx), mantendo a sessão para tentar depois.
 */
export function renovarSessao(): Promise<boolean> {
  renovacaoEmAndamento ??= (async () => {
    try {
      const refreshToken = await lerRefreshToken();
      if (!refreshToken) {
        await encerrarSessaoLocal();
        return false;
      }

      try {
        await aplicarTokens(await chamarRefresh(refreshToken));
        return true;
      } catch (erro) {
        if (erro instanceof ApiError && (erro.status === 401 || erro.status === 400)) {
          await encerrarSessaoLocal();
          return false;
        }
        throw erro;
      }
    } finally {
      renovacaoEmAndamento = null;
    }
  })();

  return renovacaoEmAndamento;
}

/** Access token utilizável agora, renovando antes se estiver para expirar. */
export async function obterAccessTokenValido(): Promise<string | null> {
  const { accessToken, accessTokenExpiraEm } = estado;
  if (accessToken && accessTokenExpiraEm && accessTokenExpiraEm - Date.now() > FOLGA_RENOVACAO_MS) {
    return accessToken;
  }
  if (!accessToken && !(await lerRefreshToken())) return null;

  return (await renovarSessao()) ? estado.accessToken : null;
}

/** Retoma a sessão ao abrir o app, a partir do refresh token guardado no aparelho. */
export async function restaurarSessao(): Promise<'autenticado' | 'anonimo'> {
  if (!(await lerRefreshToken())) return 'anonimo';
  try {
    return (await renovarSessao()) ? 'autenticado' : 'anonimo';
  } catch {
    // Sem rede agora: não apagamos o token, mas o usuário cai no login até conseguir renovar.
    return 'anonimo';
  }
}
