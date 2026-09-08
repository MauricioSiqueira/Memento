import React, { useState } from 'react';
import { FlatList, Share, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ModalQrCodeAlbum } from '@/components/albuns/ModalQrCodeAlbum';
import { VisualizadorFotos } from '@/components/albuns/VisualizadorFotos';
import { FolhaAcoes, type OpcaoFolhaAcoes } from '@/components/ui/FolhaAcoes';
import { useAlbuns } from '@/contexts/albuns-context';

const NUMERO_COLUNAS = 3;
const ESPACAMENTO = 4;

export default function TelaAlbum() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { albuns, alternarFavorito } = useAlbuns();
  const { width: larguraTela } = useWindowDimensions();
  const [indiceFotoAberta, setIndiceFotoAberta] = useState<number | null>(null);
  const [opcoesVisiveis, setOpcoesVisiveis] = useState(false);
  const [qrCodeVisivel, setQrCodeVisivel] = useState(false);

  const album = albuns.find((item) => item.id === id);
  const tamanhoFoto = (larguraTela - ESPACAMENTO * (NUMERO_COLUNAS + 1)) / NUMERO_COLUNAS;
  const linkCompartilhavel = album ? `memento://album/${album.id}` : '';

  async function aoCompartilharAlbum() {
    if (!album) return;
    try {
      await Share.share({
        message: `Entre no álbum "${album.nome}" no Memento: ${linkCompartilhavel}`,
        url: linkCompartilhavel,
      });
    } catch {
      // Usuária cancelou o compartilhamento nativo; nada a fazer.
    }
  }

  const opcoesAlbum: OpcaoFolhaAcoes[] = album
    ? [
        {
          chave: 'compartilhar',
          rotulo: 'Compartilhar álbum',
          icone: { familia: 'feather', nome: 'share-2' },
          aoSelecionar: aoCompartilharAlbum,
        },
        {
          chave: 'qrcode',
          rotulo: 'QR Code',
          icone: { familia: 'ionicons', nome: 'qr-code-outline' },
          aoSelecionar: () => setQrCodeVisivel(true),
        },
        {
          chave: 'favoritar',
          rotulo: album.favorito ? 'Remover dos favoritos' : 'Favoritar álbum',
          icone: { familia: 'ionicons', nome: album.favorito ? 'star' : 'star-outline' },
          aoSelecionar: () => alternarFavorito(album.id),
        },
      ]
    : [];

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <View style={estilos.cabecalho}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color="#4A3A35" />
        </TouchableOpacity>

        <Text style={estilos.titulo} numberOfLines={1}>
          {album?.nome ?? 'Álbum'}
        </Text>

        {album ? (
          <TouchableOpacity onPress={() => setOpcoesVisiveis(true)} hitSlop={12}>
            <Feather name="more-horizontal" size={22} color="#4A3A35" />
          </TouchableOpacity>
        ) : (
          <View style={estilos.espacoCabecalho} />
        )}
      </View>

      {!album ? (
        <View style={estilos.containerVazio}>
          <Text style={estilos.textoVazio}>Este álbum não foi encontrado.</Text>
        </View>
      ) : album.fotos.length === 0 ? (
        <View style={estilos.containerVazio}>
          <Feather name="image" size={40} color="#B0A6A4" />
          <Text style={estilos.textoVazio}>Este álbum ainda não tem fotos.</Text>
        </View>
      ) : (
        <FlatList
          data={album.fotos}
          keyExtractor={(uri, indice) => `${uri}-${indice}`}
          numColumns={NUMERO_COLUNAS}
          contentContainerStyle={estilos.grade}
          columnWrapperStyle={estilos.linhaGrade}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setIndiceFotoAberta(index)}>
              <Image
                source={item}
                style={[estilos.foto, { width: tamanhoFoto, height: tamanhoFoto }]}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}
        />
      )}

      {album && (
        <>
          <VisualizadorFotos
            visivel={indiceFotoAberta !== null}
            fotos={album.fotos}
            indiceInicial={indiceFotoAberta ?? 0}
            aoFechar={() => setIndiceFotoAberta(null)}
          />

          <FolhaAcoes
            visivel={opcoesVisiveis}
            titulo="Opções do álbum"
            alturaFracao={0.32}
            opcoes={opcoesAlbum}
            aoFechar={() => setOpcoesVisiveis(false)}
          />

          <ModalQrCodeAlbum
            visivel={qrCodeVisivel}
            nomeAlbum={album.nome}
            link={linkCompartilhavel}
            aoFechar={() => setQrCodeVisivel(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3A35',
  },
  espacoCabecalho: {
    width: 22,
  },
  containerVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  textoVazio: {
    color: '#6A5A55',
    fontSize: 14,
    textAlign: 'center',
  },
  grade: {
    paddingHorizontal: ESPACAMENTO,
    paddingBottom: 32,
  },
  linhaGrade: {
    gap: ESPACAMENTO,
    marginBottom: ESPACAMENTO,
  },
  foto: {
    borderRadius: 8,
    backgroundColor: '#EFEAE7',
  },
});
