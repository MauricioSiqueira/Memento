import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHAVE_REFRESH_TOKEN = 'memento.refresh_token';

/**
 * Só o refresh token é persistido (Keychain/Keystore via SecureStore). O access token
 * vive apenas em memória: dura 15 min e é reemitido a partir do refresh token.
 *
 * O SecureStore não existe na web; lá cai para `localStorage`, que é menos seguro
 * (aceitável apenas para desenvolvimento/preview, o app alvo é iOS/Android).
 */
export async function lerRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(CHAVE_REFRESH_TOKEN) ?? null;
  return SecureStore.getItemAsync(CHAVE_REFRESH_TOKEN);
}

export async function salvarRefreshToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(CHAVE_REFRESH_TOKEN, token);
    return;
  }
  await SecureStore.setItemAsync(CHAVE_REFRESH_TOKEN, token);
}

export async function apagarRefreshToken(): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(CHAVE_REFRESH_TOKEN);
    return;
  }
  await SecureStore.deleteItemAsync(CHAVE_REFRESH_TOKEN);
}
