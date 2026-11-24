import { useCallback, useState } from 'react';

import {
  aplicarMascaraData,
  validarConfirmacaoSenha,
  validarDataNascimento,
  validarEmail,
  validarNomeUsuario,
  validarSenha,
} from '@/features/auth/utils/validacao';

export interface ValoresFormularioCadastro {
  nomeUsuario: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  dataNascimento: string;
}

export type CampoFormularioCadastro = keyof ValoresFormularioCadastro;
export type ErrosFormularioCadastro = Partial<Record<CampoFormularioCadastro, string>>;

const VALORES_INICIAIS: ValoresFormularioCadastro = {
  nomeUsuario: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  dataNascimento: '',
};

const CAMPOS_OBRIGATORIOS: CampoFormularioCadastro[] = [
  'nomeUsuario',
  'email',
  'senha',
  'confirmarSenha',
  'dataNascimento',
];

function validarCampo(
  campo: CampoFormularioCadastro,
  valores: ValoresFormularioCadastro
): string | null {
  switch (campo) {
    case 'nomeUsuario':
      return validarNomeUsuario(valores.nomeUsuario);
    case 'email':
      return validarEmail(valores.email);
    case 'senha':
      return validarSenha(valores.senha);
    case 'confirmarSenha':
      return validarConfirmacaoSenha(valores.senha, valores.confirmarSenha);
    case 'dataNascimento':
      return validarDataNascimento(valores.dataNascimento);
  }
}

interface OpcoesFormularioCadastro {
  /** Pode devolver erros por campo (ex.: e-mail já em uso) para serem exibidos no formulário. */
  aoCadastrar: (valores: ValoresFormularioCadastro) => void | ErrosFormularioCadastro | Promise<void | ErrosFormularioCadastro>;
}

export function useFormularioCadastro({ aoCadastrar }: OpcoesFormularioCadastro) {
  const [valores, setValores] = useState<ValoresFormularioCadastro>(VALORES_INICIAIS);
  const [erros, setErros] = useState<ErrosFormularioCadastro>({});
  const [enviando, setEnviando] = useState(false);

  const alterarCampo = useCallback((campo: CampoFormularioCadastro, valor: string) => {
    const valorFormatado = campo === 'dataNascimento' ? aplicarMascaraData(valor) : valor;

    setValores((valoresAtuais) => ({ ...valoresAtuais, [campo]: valorFormatado }));
    setErros((errosAtuais) => ({ ...errosAtuais, [campo]: undefined }));
  }, []);

  const submeter = useCallback(async () => {
    const proximosErros: ErrosFormularioCadastro = {};
    for (const campo of CAMPOS_OBRIGATORIOS) {
      const mensagemErro = validarCampo(campo, valores);
      if (mensagemErro) proximosErros[campo] = mensagemErro;
    }

    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    setEnviando(true);
    try {
      const errosDoServidor = await aoCadastrar(valores);
      if (errosDoServidor) setErros(errosDoServidor);
    } finally {
      setEnviando(false);
    }
  }, [valores, aoCadastrar]);

  return { valores, erros, enviando, alterarCampo, submeter };
}
