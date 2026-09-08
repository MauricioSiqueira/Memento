const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_SENHA_COMPLEXA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).+$/;
const REGEX_DATA = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const TAMANHO_MINIMO_SENHA = 8;
export const TAMANHO_MAXIMO_SENHA = 16;
export const TAMANHO_MINIMO_NOME_USUARIO = 3;
const ANO_MINIMO_NASCIMENTO = 1900;

export function validarNomeUsuario(nomeUsuario: string): string | null {
  const valor = nomeUsuario.trim();
  if (!valor) return 'Informe um nome de usuário.';
  if (valor.length < TAMANHO_MINIMO_NOME_USUARIO) {
    return `O nome de usuário deve ter pelo menos ${TAMANHO_MINIMO_NOME_USUARIO} caracteres.`;
  }
  if (/\s/.test(valor)) return 'O nome de usuário não pode conter espaços.';
  return null;
}

export function validarEmail(email: string): string | null {
  const valor = email.trim();
  if (!valor) return 'Informe seu e-mail.';
  if (!REGEX_EMAIL.test(valor)) return 'Informe um e-mail válido.';
  return null;
}

export function validarSenha(senha: string): string | null {
  if (!senha) return 'Informe uma senha.';
  if (senha.length < TAMANHO_MINIMO_SENHA || senha.length > TAMANHO_MAXIMO_SENHA) {
    return `A senha deve ter entre ${TAMANHO_MINIMO_SENHA} e ${TAMANHO_MAXIMO_SENHA} caracteres.`;
  }
  if (!REGEX_SENHA_COMPLEXA.test(senha)) {
    return 'A senha deve ter letra maiúscula, minúscula, número e símbolo.';
  }
  return null;
}

export function validarConfirmacaoSenha(senha: string, confirmacaoSenha: string): string | null {
  if (!confirmacaoSenha) return 'Confirme sua senha.';
  if (confirmacaoSenha !== senha) return 'As senhas não coincidem.';
  return null;
}

/** Formata dígitos digitados no padrão dd/mm/aaaa conforme o usuário digita. */
export function aplicarMascaraData(texto: string): string {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  const dia = digitos.slice(0, 2);
  const mes = digitos.slice(2, 4);
  const ano = digitos.slice(4, 8);
  return [dia, mes, ano].filter(Boolean).join('/');
}

/** Converte "dd/mm/aaaa" em Date, retornando null se não representar uma data real. */
export function converterParaData(dataTextual: string): Date | null {
  const combinacao = REGEX_DATA.exec(dataTextual);
  if (!combinacao) return null;

  const [, diaTexto, mesTexto, anoTexto] = combinacao;
  const dia = Number(diaTexto);
  const mes = Number(mesTexto);
  const ano = Number(anoTexto);
  const data = new Date(ano, mes - 1, dia);

  const dataRepresentaEntradaExata =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;

  return dataRepresentaEntradaExata ? data : null;
}

export function validarDataNascimento(dataTextual: string): string | null {
  if (!dataTextual) return 'Informe sua data de nascimento.';

  const data = converterParaData(dataTextual);
  if (!data) return 'Informe uma data válida (dd/mm/aaaa).';
  if (data.getTime() > Date.now()) return 'A data de nascimento não pode ser no futuro.';
  if (data.getFullYear() < ANO_MINIMO_NASCIMENTO) {
    return `Informe um ano a partir de ${ANO_MINIMO_NASCIMENTO}.`;
  }
  return null;
}
