import React, { useState } from 'react';
import { FlatList, Share, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { ModalQrCodeAlbum } from '@/features/albums/components/ModalQrCodeAlbum';
import { VisualizadorFotos } from '@/features/albums/components/VisualizadorFotos';
import { FolhaAcoes, type OpcaoFolhaAcoes } from '@/components/ui/FolhaAcoes';
import { useAlbuns } from '@/features/albums/context/albuns-context';

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
    <SafeAreaView className="flex-1 bg-memento-canvas" edges={['top']}>
      <View className="flex-row items-center justify-between gap-4 px-6 pb-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color="#4A3A35" />
        </TouchableOpacity>

        <AccessibleText className="flex-1 text-center text-lg font-bold text-memento-ink" numberOfLines={1}>
          {album?.nome ?? 'Álbum'}
        </AccessibleText>

        {album ? (
          <TouchableOpacity onPress={() => setOpcoesVisiveis(true)} hitSlop={12}>
            <Feather name="more-horizontal" size={22} color="#4A3A35" />
          </TouchableOpacity>
        ) : (
          <View className="w-[22px]" />
        )}
      </View>

      {!album ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <AccessibleText className="text-center text-sm text-memento-muted">Este álbum não foi encontrado.</AccessibleText>
        </View>
      ) : album.fotos.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Feather name="image" size={40} color="#B0A6A4" />
          <AccessibleText className="text-center text-sm text-memento-muted">Este álbum ainda não tem fotos.</AccessibleText>
        </View>
      ) : (
        <FlatList
          data={album.fotos}
          keyExtractor={(uri, indice) => `${uri}-${indice}`}
          numColumns={NUMERO_COLUNAS}
          contentContainerClassName="px-1 pb-8"
          columnWrapperStyle={{ gap: ESPACAMENTO, marginBottom: ESPACAMENTO }}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setIndiceFotoAberta(index)}>
              <Image
                source={item}
                style={{ width: tamanhoFoto, height: tamanhoFoto, borderRadius: 8, backgroundColor: '#EFEAE7' }}
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
