/** Erro de uma chamada à API, já com mensagem pronta para o usuário. */
export class ApiError extends Error {
  /** Status HTTP; `0` quando nem chegou ao servidor (sem rede, servidor fora do ar). */
  readonly status: number;
  /** Erros por campo (`nomeUsuario`, `email`...) devolvidos em respostas 400/409. */
  readonly campos: Record<string, string>;

  constructor(status: number, mensagem: string, campos: Record<string, string> = {}) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos;
  }
}

export const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

/** Converte uma resposta de erro (RFC 7807 / ValidationProblemDetails) em `ApiError`. */
export async function erroDaResposta(resposta: Response): Promise<ApiError> {
  let problema: ProblemDetails = {};
  try {
    problema = (await resposta.json()) as ProblemDetails;
  } catch {
    // Corpo vazio ou não-JSON (ex.: 401 do middleware sem corpo).
  }

  const campos: Record<string, string> = {};
  for (const [campo, mensagens] of Object.entries(problema.errors ?? {})) {
    if (mensagens[0]) campos[campo] = mensagens[0];
  }

  return new ApiError(resposta.status, problema.title ?? mensagemPadrao(resposta.status), campos);
}

function mensagemPadrao(status: number): string {
  if (status === 401) return 'Sessão expirada. Faça login novamente.';
  if (status === 403) return 'Você não tem permissão para esta ação.';
  if (status === 404) return 'Não encontramos o que você procura.';
  if (status === 413) return 'O arquivo enviado é grande demais.';
  if (status === 429) return 'Muitas tentativas. Aguarde um instante e tente novamente.';
  if (status >= 500) return 'Algo deu errado no servidor. Tente novamente em instantes.';
  return 'Não foi possível concluir a operação.';
}

/** Mensagem amigável para qualquer erro capturado (inclusive os que não vieram da API). */
export function mensagemDeErro(erro: unknown): string {
  return erro instanceof ApiError ? erro.message : 'Ocorreu um erro inesperado. Tente novamente.';
}
