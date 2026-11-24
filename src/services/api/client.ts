import { API_URL } from '@/services/api/config';
import { ApiError, erroDaResposta, MENSAGEM_SEM_CONEXAO } from '@/services/api/erros';
import { obterAccessTokenValido, renovarSessao } from '@/services/api/sessao';

interface OpcoesRequisicao {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** Corpo JSON. */
  json?: unknown;
  /** Corpo multipart (o `Content-Type` com o boundary é definido pelo runtime). */
  formulario?: FormData;
  /** Rotas públicas (cadastro/login) não enviam nem renovam token. @default true */
  autenticada?: boolean;
}

async function enviar(caminho: string, opcoes: OpcoesRequisicao, token: string | null): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let corpo: BodyInit | undefined;
  if (opcoes.formulario) {
    corpo = opcoes.formulario;
  } else if (opcoes.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    corpo = JSON.stringify(opcoes.json);
  }

  try {
    return await fetch(`${API_URL}${caminho}`, { method: opcoes.metodo ?? 'GET', headers, body: corpo });
  } catch {
    throw new ApiError(0, MENSAGEM_SEM_CONEXAO);
  }
}

/**
 * Chamada à API. Em rotas autenticadas anexa o Bearer e, diante de um 401, renova a sessão
 * uma única vez e repete a requisição. Respostas não-2xx viram `ApiError`.
 */
export async function requisitar(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<Response> {
  const autenticada = opcoes.autenticada ?? true;

  let token: string | null = null;
  if (autenticada) {
    token = await obterAccessTokenValido();
    if (!token) throw new ApiError(401, 'Sessão expirada. Faça login novamente.');
  }

  let resposta = await enviar(caminho, opcoes, token);

  if (autenticada && resposta.status === 401) {
    if (!(await renovarSessao())) throw new ApiError(401, 'Sessão expirada. Faça login novamente.');
    token = await obterAccessTokenValido();
    resposta = await enviar(caminho, opcoes, token);
  }

  if (!resposta.ok) throw await erroDaResposta(resposta);
  return resposta;
}

/** Como `requisitar`, devolvendo o corpo JSON tipado. */
export async function requisitarJson<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const resposta = await requisitar(caminho, opcoes);
  return (await resposta.json()) as T;
}
