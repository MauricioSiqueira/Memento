import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Feather } from '@expo/vector-icons';

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
      <Pressable style={estilos.fundo} onPress={aoFechar}>
        <Pressable style={estilos.cartao} onPress={() => {}}>
          <TouchableOpacity style={estilos.botaoFechar} onPress={aoFechar} hitSlop={12}>
            <Feather name="x" size={20} color="#4A3A35" />
          </TouchableOpacity>

          <Text style={estilos.titulo} numberOfLines={2}>
            Convidar para "{nomeAlbum}"
          </Text>
          <Text style={estilos.subtitulo}>
            Peça para a pessoa escanear este código para entrar no álbum.
          </Text>

          <View style={estilos.containerQrCode}>
            <QRCode value={link} size={200} color="#4A3A35" backgroundColor="#FFFFFF" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(74, 58, 53, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cartao: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  botaoFechar: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5F2',
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A3A35',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 13,
    color: '#8A7A75',
    textAlign: 'center',
    marginBottom: 20,
  },
  containerQrCode: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEAE7',
  },
});
