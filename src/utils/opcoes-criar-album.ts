import { router } from 'expo-router';

import type { OpcaoFolhaAcoes } from '@/components/ui/FolhaAcoes';

/** Opções da folha de "+": escanear QR Code para entrar em um álbum, ou criar um novo. */
export function criarOpcoesNovoAlbum(): OpcaoFolhaAcoes[] {
  return [
    {
      chave: 'escanear-qrcode',
      rotulo: 'Escanear QR Code',
      icone: { familia: 'feather', nome: 'camera' },
      aoSelecionar: () => router.push('/scanner'),
    },
    {
      chave: 'novo-album',
      rotulo: 'Criar álbum',
      icone: { familia: 'feather', nome: 'folder-plus' },
      aoSelecionar: () => router.push('/criar-album'),
    },
  ];
}
