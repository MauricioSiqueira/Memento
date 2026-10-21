import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router, useIsFocused } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { useAlbuns } from '@/features/albums/context/albuns-context';

export default function TelaScanner() {
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const [qrLido, setQrLido] = useState(false);
  const tentouSolicitarPermissao = useRef(false);
  const focada = useIsFocused();
  const insets = useSafeAreaInsets();
  const { albuns } = useAlbuns();

  useEffect(() => {
    if (permissao && !permissao.granted && permissao.canAskAgain && !tentouSolicitarPermissao.current) {
      tentouSolicitarPermissao.current = true;
      solicitarPermissao();
    }
  }, [permissao, solicitarPermissao]);

  const aoLerQrCode = useCallback((resultado: BarcodeScanningResult) => {
    if (qrLido) return;
    setQrLido(true);

    const idAlbum = resultado.data.match(/(?:memento:\/\/album\/|\/album\/)([^/?#]+)/)?.[1];
    const album = albuns.find((item) => item.id === idAlbum);

    if (album) {
      Alert.alert('Álbum encontrado', `Deseja abrir “${album.nome}”?`, [
        { text: 'Continuar escaneando', onPress: () => setQrLido(false) },
        { text: 'Abrir álbum', onPress: () => router.replace(`/album/${album.id}`) },
      ]);
      return;
    }

    Alert.alert(
      idAlbum ? 'Álbum indisponível' : 'QR Code não reconhecido',
      idAlbum
        ? 'Este álbum ainda não está disponível neste dispositivo.'
        : 'Aponte a câmera para o QR Code de compartilhamento de um álbum do Memento.',
      [{ text: 'Tentar novamente', onPress: () => setQrLido(false) }]
    );
  }, [albuns, qrLido]);

  if (!permissao) {
    return <View className="flex-1 items-center justify-center bg-black" />;
  }

  if (!permissao.granted) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-memento-canvas px-8 dark:bg-memento-canvas-dark">
        <Feather name="camera" size={44} color="#4A3A35" />
        <AccessibleText className="text-center text-lg font-bold text-memento-ink dark:text-memento-ink-dark">
          Permita o acesso à câmera
        </AccessibleText>
        <AccessibleText className="text-center text-sm text-memento-muted dark:text-memento-muted-dark">
          Precisamos da câmera para ler o QR Code do álbum.
        </AccessibleText>
        <Pressable
          className="rounded-full bg-memento-accent px-6 py-3"
          onPress={permissao.canAskAgain ? solicitarPermissao : () => Linking.openSettings()}
          accessibilityRole="button"
        >
          <AccessibleText className="font-semibold text-white">
            {permissao.canAskAgain ? 'Permitir câmera' : 'Abrir configurações'}
          </AccessibleText>
        </Pressable>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
          <AccessibleText className="py-2 text-sm font-semibold text-memento-muted dark:text-memento-muted-dark">Voltar</AccessibleText>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {focada && (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          active={focada}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={qrLido ? undefined : aoLerQrCode}
        />
      )}

      <View className="absolute left-0 right-0 flex-row items-center px-5" style={{ top: insets.top + 12 }}>
        <Pressable
          className="h-11 w-11 items-center justify-center rounded-full bg-black/45"
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Fechar leitor de QR Code"
        >
          <Feather name="x" size={24} color="#FFFFFF" />
        </Pressable>
        <AccessibleText className="flex-1 pr-11 text-center text-lg font-bold text-white">
          Escanear QR Code
        </AccessibleText>
      </View>

      <View className="absolute left-0 right-0 items-center px-8" style={{ top: '34%' }} pointerEvents="none">
        <View className="h-64 w-64 rounded-[28px] border-2 border-white/90" />
        <AccessibleText className="mt-6 rounded-full bg-black/50 px-4 py-2 text-center text-sm text-white">
          Posicione o QR Code dentro do quadro
        </AccessibleText>
      </View>
    </View>
  );
}
