import React from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Feather } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';

interface ModalQrCodeAlbumProps {
  visivel: boolean;
  aoFechar: () => void;
  nomeAlbum: string;
  link: string;
}

/** Modal centralizado com o QR Code do álbum, para outra pessoa escanear e entrar como colaboradora. */
export function ModalQrCodeAlbum({ visivel, aoFechar, nomeAlbum, link }: ModalQrCodeAlbumProps) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable className="flex-1 items-center justify-center bg-[#4A3A35]/50 p-8" onPress={aoFechar}>
        <Pressable className="w-full max-w-80 items-center rounded-3xl bg-white p-6" onPress={() => {}}>
          <TouchableOpacity className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full bg-memento-canvas" onPress={aoFechar} hitSlop={12}>
            <Feather name="x" size={20} color="#4A3A35" />
          </TouchableOpacity>

          <AccessibleText className="mb-2 mt-2 text-center text-[17px] font-bold text-memento-ink" numberOfLines={2}>
            Convidar para "{nomeAlbum}"
          </AccessibleText>
          <AccessibleText className="mb-5 text-center text-[13px] text-[#8A7A75]">
            Peça para a pessoa escanear este código para entrar no álbum.
          </AccessibleText>

          <View className="rounded-2xl border border-memento-line bg-white p-4">
            <QRCode value={link} size={200} color="#4A3A35" backgroundColor="#FFFFFF" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

