import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const PORTA_API_PADRAO = 5077;

/**
 * URL base da API (sem barra final).
 *
 * Ordem de resolução:
 * 1. `EXPO_PUBLIC_API_URL` (obrigatório em builds de produção);
 * 2. web e simulador iOS: `localhost`;
 * 3. emulador Android: `10.0.2.2` (alias do emulador para o `localhost` da máquina);
 * 4. celular físico: o IP da máquina que serve o Metro (`hostUri`). Nesse caso a API precisa
 *    escutar fora do loopback, ex.: `dotnet run --project src/Memento.Api --urls http://0.0.0.0:5077`.
 */
function resolverUrlBase(): string {
  const doAmbiente = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (doAmbiente) return doAmbiente.replace(/\/+$/, '');

  if (Platform.OS === 'web') return `http://localhost:${PORTA_API_PADRAO}`;

  if (!Device.isDevice) {
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    return `http://${host}:${PORTA_API_PADRAO}`;
  }

  const hostMetro = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${hostMetro ?? 'localhost'}:${PORTA_API_PADRAO}`;
}

export const API_URL = resolverUrlBase();
