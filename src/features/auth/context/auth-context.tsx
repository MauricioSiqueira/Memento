import { Image } from 'expo-image';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import * as authApi from '@/features/auth/api/auth-api';
import * as usuariosApi from '@/features/auth/api/usuarios-api';
import type { ArquivoLocal } from '@/services/api/anexar-arquivo';
import {
  assinarSessao,
  atualizarUsuarioDaSessao,
  encerrarSessaoLocal,
  iniciarSessao,
  obterAccessTokenValido,
  obterEstadoSessao,
  restaurarSessao,
  type EstadoSessao,
} from '@/services/api/sessao';
import type { CadastroRequest, UsuarioDto } from '@/services/api/tipos';

type StatusAuth = 'carregando' | 'autenticado' | 'anonimo';

interface AuthContextValue {
  status: StatusAuth;
  usuario: UsuarioDto | null;
  /** Access token atual; usado para carregar imagens, que exigem o header Authorization. */
  accessToken: string | null;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: CadastroRequest) => Promise<void>;
  sair: () => Promise<void>;
  atualizarNomeUsuario: (nomeUsuario: string) => Promise<void>;
  trocarFotoPerfil: (arquivo: ArquivoLocal) => Promise<void>;
  removerFotoPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ANTECEDENCIA_RENOVACAO_MS = 90_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<StatusAuth>('carregando');
  const [sessao, setSessao] = useState<EstadoSessao>(obterEstadoSessao);

  // A sessão em memória é a fonte da verdade; o contexto só a espelha para a UI.
  useEffect(() => {
    const cancelar = assinarSessao((proxima) => {
      setSessao(proxima);
      if (!proxima.accessToken) setStatus((atual) => (atual === 'carregando' ? atual : 'anonimo'));
    });

    restaurarSessao().then(setStatus);
    return cancelar;
  }, []);

  // Renova o access token pouco antes de expirar, para que as imagens (que usam o token do
  // estado) não carreguem com um token vencido.
  const expiraEm = sessao.accessTokenExpiraEm;
  useEffect(() => {
    if (!expiraEm) return;
    const espera = Math.max(expiraEm - Date.now() - ANTECEDENCIA_RENOVACAO_MS, 0);
    const temporizador = setTimeout(() => void obterAccessTokenValido().catch(() => {}), espera);
    return () => clearTimeout(temporizador);
  }, [expiraEm]);

  // Temporizadores podem ficar suspensos com o app em segundo plano: ao voltar, confere o token.
  useEffect(() => {
    const assinatura = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') void obterAccessTokenValido().catch(() => {});
    });
    return () => assinatura.remove();
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    await iniciarSessao(await authApi.login(email.trim(), senha));
    setStatus('autenticado');
  }, []);

  const cadastrar = useCallback(async (dados: CadastroRequest) => {
    await authApi.cadastrar(dados);
  }, []);

  const sair = useCallback(async () => {
    await authApi.logout();
    await encerrarSessaoLocal();
    // Imagens ficam em cache pela URL; limpa para não vazar fotos para a próxima conta.
    await Image.clearDiskCache();
    Image.clearMemoryCache();
    setStatus('anonimo');
  }, []);

  const atualizarNomeUsuario = useCallback(async (nomeUsuario: string) => {
    atualizarUsuarioDaSessao(await usuariosApi.atualizarNomeUsuario(nomeUsuario));
  }, []);

  const trocarFotoPerfil = useCallback(async (arquivo: ArquivoLocal) => {
    atualizarUsuarioDaSessao(await usuariosApi.trocarFotoPerfil(arquivo));
  }, []);

  const removerFotoPerfil = useCallback(async () => {
    atualizarUsuarioDaSessao(await usuariosApi.removerFotoPerfil());
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({
      status,
      usuario: sessao.usuario,
      accessToken: sessao.accessToken,
      entrar,
      cadastrar,
      sair,
      atualizarNomeUsuario,
      trocarFotoPerfil,
      removerFotoPerfil,
    }),
    [status, sessao.usuario, sessao.accessToken, entrar, cadastrar, sair, atualizarNomeUsuario, trocarFotoPerfil, removerFotoPerfil]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return contexto;
}
