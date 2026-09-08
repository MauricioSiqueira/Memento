import { Alert } from 'react-native';
import { router } from 'expo-router';

import type { OpcaoFolhaAcoes } from '@/components/ui/FolhaAcoes';

/** Opções da folha de "+": escanear QR Code para entrar em um álbum, ou criar um novo. */
export function criarOpcoesNovoAlbum(): OpcaoFolhaAcoes[] {
  return [
    {
      chave: 'escanear-qrcode',
      rotulo: 'Escanear QR Code',
      icone: { familia: 'feather', nome: 'camera' },
      aoSelecionar: () =>
        Alert.alert(
          'Escanear QR Code',
          'A leitura de QR Code para entrar em um álbum compartilhado ainda não está disponível.'
        ),
    },
    {
      chave: 'novo-album',
      rotulo: 'Criar álbum',
      icone: { familia: 'feather', nome: 'folder-plus' },
      aoSelecionar: () => router.push('/criar-album'),
    },
  ];
}
