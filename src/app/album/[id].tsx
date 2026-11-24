import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, Share, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { ImagemAutenticada } from '@/components/ui/ImagemAutenticada';
import { ModalQrCodeAlbum } from '@/features/albums/components/ModalQrCodeAlbum';
import { VisualizadorFotos } from '@/features/albums/components/VisualizadorFotos';
import { FolhaAcoes, type OpcaoFolhaAcoes } from '@/components/ui/FolhaAcoes';
import { useAlbuns } from '@/features/albums/context/albuns-context';
import { useAlternarFavorito } from '@/features/albums/hooks/use-alternar-favorito';
import { usePreferences } from '@/contexts/preferences-context';
import type { ArquivoLocal } from '@/services/api/anexar-arquivo';
import { mensagemDeErro } from '@/services/api/erros';

const NUMERO_COLUNAS = 3;
const ESPACAMENTO = 4;

export default function TelaAlbum() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { albuns, carregarAlbum, adicionarFotos, removerFotos, obterLinkConvite } = useAlbuns();
  const alternarFavorito = useAlternarFavorito();
  const { temaEscuro } = usePreferences();
  const { width: larguraTela } = useWindowDimensions();
  const [indiceFotoAberta, setIndiceFotoAberta] = useState<number | null>(null);
  const [opcoesVisiveis, setOpcoesVisiveis] = useState(false);
  const [qrCodeVisivel, setQrCodeVisivel] = useState(false);
  const [adicionarFotoVisivel, setAdicionarFotoVisivel] = useState(false);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [fotosSelecionadas, setFotosSelecionadas] = useState<number[]>([]);
  const [carregandoAlbum, setCarregandoAlbum] = useState(true);
  const [erroAlbum, setErroAlbum] = useState<string | null>(null);
  const [processandoFotos, setProcessandoFotos] = useState(false);
  const [linkConvite, setLinkConvite] = useState<string | null>(null);
  const [erroConvite, setErroConvite] = useState<string | null>(null);

  const album = albuns.find((item) => item.id === id);
  const tamanhoFoto = (larguraTela - ESPACAMENTO * (NUMERO_COLUNAS + 1)) / NUMERO_COLUNAS;

  useEffect(() => {
    if (!id) return;
    let ativo = true;
    setCarregandoAlbum(true);
    setErroAlbum(null);
    setLinkConvite(null);
    carregarAlbum(id)
      .catch((erro) => ativo && setErroAlbum(mensagemDeErro(erro)))
      .finally(() => ativo && setCarregandoAlbum(false));
    return () => {
      ativo = false;
    };
  }, [id, carregarAlbum]);

  /** O link de convite vem da API (token permanente por álbum); é buscado sob demanda e reaproveitado. */
  async function buscarLinkConvite(): Promise<string | null> {
    if (!album) return null;
    if (linkConvite) return linkConvite;
    try {
      const link = await obterLinkConvite(album.id);
      setLinkConvite(link);
      setErroConvite(null);
      return link;
    } catch (erro) {
      setErroConvite(mensagemDeErro(erro));
      return null;
    }
  }

  function abrirQrCode() {
    setErroConvite(null);
    setQrCodeVisivel(true);
    void buscarLinkConvite();
  }

  function sairDaSelecao() {
    setModoSelecao(false);
    setFotosSelecionadas([]);
  }

  function alternarSelecaoFoto(indice: number) {
    setFotosSelecionadas((atuais) =>
      atuais.includes(indice) ? atuais.filter((item) => item !== indice) : [...atuais, indice]
    );
  }

  function confirmarRemocao(indices: number[]) {
    if (!album || indices.length === 0) return;
    const quantidade = indices.length;
    const arquivoIds = indices.map((indice) => album.fotos[indice]?.arquivoId).filter((arquivoId): arquivoId is string => Boolean(arquivoId));
    Alert.alert(
      quantidade === 1 ? 'Remover foto?' : `Remover ${quantidade} fotos?`,
      quantidade === 1
        ? 'Esta foto será removida do álbum.'
        : 'As fotos selecionadas serão removidas do álbum.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setIndiceFotoAberta(null);
            sairDaSelecao();
            setProcessandoFotos(true);
            const { removidas, erro } = await removerFotos(album.id, arquivoIds);
            setProcessandoFotos(false);
            if (erro) {
              Alert.alert(
                removidas === 0 ? 'Não foi possível remover' : 'Algumas fotos não foram removidas',
                erro
              );
            }
          },
        },
      ]
    );
  }

  function avisarPermissaoNegada(recurso: string) {
    Alert.alert(
      'Permissão necessária',
      `Para adicionar fotos, permita o acesso a ${recurso} nas configurações do dispositivo.`,
      [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
      ]
    );
  }

  async function enviarFotos(albumId: string, assets: ImagePicker.ImagePickerAsset[]) {
    const arquivos: ArquivoLocal[] = assets.map((foto) => ({
      uri: foto.uri,
      nome: foto.fileName,
      tipo: foto.mimeType,
    }));

    setProcessandoFotos(true);
    try {
      await adicionarFotos(albumId, arquivos);
    } catch (erro) {
      Alert.alert('Não foi possível enviar as fotos', mensagemDeErro(erro));
    } finally {
      setProcessandoFotos(false);
    }
  }

  async function aoEscolherDaGaleria() {
    if (!album) return;
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        avisarPermissaoNegada('suas fotos');
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.85,
      });
      if (!resultado.canceled) await enviarFotos(album.id, resultado.assets);
    } catch {
      Alert.alert('Não foi possível abrir a galeria', 'Tente novamente em instantes.');
    }
  }

  async function aoTirarFoto() {
    if (!album) return;
    try {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissao.granted) {
        avisarPermissaoNegada('a câmera');
        return;
      }
      const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 });
      if (!resultado.canceled) await enviarFotos(album.id, resultado.assets);
    } catch {
      Alert.alert('Não foi possível abrir a câmera', 'Tente novamente em instantes.');
    }
  }

  const opcoesAdicionarFoto: OpcaoFolhaAcoes[] = [
    {
      chave: 'galeria',
      rotulo: 'Escolher da galeria',
      icone: { familia: 'feather', nome: 'image' },
      aoSelecionar: aoEscolherDaGaleria,
    },
    {
      chave: 'camera',
      rotulo: 'Tirar foto',
      icone: { familia: 'feather', nome: 'camera' },
      aoSelecionar: aoTirarFoto,
    },
  ];

  async function aoCompartilharAlbum() {
    if (!album) return;
    const link = await buscarLinkConvite();
    if (!link) {
      Alert.alert('Não foi possível compartilhar', 'Não conseguimos gerar o convite agora. Tente novamente.');
      return;
    }
    try {
      await Share.share({
        message: `Entre no álbum "${album.nome}" no Memento: ${link}`,
        url: link,
      });
    } catch {
      // Usuária cancelou o compartilhamento nativo; nada a fazer.
    }
  }

  const opcoesAlbum: OpcaoFolhaAcoes[] = album
    ? [
        {
          chave: 'selecionar-fotos',
          rotulo: 'Selecionar fotos para remover',
          icone: { familia: 'feather', nome: 'check-square' },
          aoSelecionar: () => {
            setFotosSelecionadas([]);
            setModoSelecao(true);
          },
        },
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
          aoSelecionar: abrirQrCode,
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
    <SafeAreaView className="flex-1 bg-memento-canvas dark:bg-memento-canvas-dark" edges={['top']}>
      <View className="flex-row items-center justify-between gap-4 px-6 pb-4 pt-2">
        {modoSelecao ? (
          <TouchableOpacity onPress={sairDaSelecao} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cancelar seleção">
            <Feather name="x" size={22} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
          </TouchableOpacity>
        )}

        <AccessibleText className="flex-1 text-center text-lg font-bold text-memento-ink dark:text-memento-ink-dark" numberOfLines={1}>
          {modoSelecao ? `${fotosSelecionadas.length} selecionada(s)` : album?.nome ?? 'Álbum'}
        </AccessibleText>

        {album && modoSelecao ? (
          <TouchableOpacity
            onPress={() => confirmarRemocao(fotosSelecionadas)}
            disabled={fotosSelecionadas.length === 0}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Remover fotos selecionadas"
          >
            <Feather name="trash-2" size={22} color={fotosSelecionadas.length ? '#E0637A' : (temaEscuro ? '#6F666A' : '#C9C1BE')} />
          </TouchableOpacity>
        ) : album ? (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => setAdicionarFotoVisivel(true)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Adicionar fotos ao álbum"
            >
              <Feather name="plus-circle" size={24} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOpcoesVisiveis(true)} hitSlop={12} accessibilityRole="button" accessibilityLabel="Opções do álbum">
              <Feather name="more-horizontal" size={22} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-[22px]" />
        )}
      </View>

      {!album ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          {carregandoAlbum ? (
            <ActivityIndicator />
          ) : (
            <AccessibleText className="text-center text-sm text-memento-muted dark:text-memento-muted-dark">
              {erroAlbum ?? 'Este álbum não foi encontrado.'}
            </AccessibleText>
          )}
        </View>
      ) : album.fotos.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          {carregandoAlbum && !album.fotosCarregadas ? (
            <ActivityIndicator />
          ) : (
            <>
              <Feather name="image" size={40} color={temaEscuro ? '#A99DA2' : '#B0A6A4'} />
              <AccessibleText className="text-center text-sm text-memento-muted dark:text-memento-muted-dark">
                {erroAlbum ?? 'Este álbum ainda não tem fotos.'}
              </AccessibleText>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={album.fotos}
          keyExtractor={(foto) => foto.arquivoId}
          numColumns={NUMERO_COLUNAS}
          contentContainerClassName="px-1 pb-8"
          columnWrapperStyle={{ gap: ESPACAMENTO, marginBottom: ESPACAMENTO }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => modoSelecao ? alternarSelecaoFoto(index) : setIndiceFotoAberta(index)}
              onLongPress={() => {
                if (!modoSelecao) setModoSelecao(true);
                alternarSelecaoFoto(index);
              }}
              accessibilityRole="button"
              accessibilityLabel={modoSelecao ? `Selecionar foto ${index + 1}` : `Abrir foto ${index + 1}`}
              accessibilityState={{ selected: fotosSelecionadas.includes(index) }}
            >
              <ImagemAutenticada
                url={item.url}
                style={{ width: tamanhoFoto, height: tamanhoFoto, borderRadius: 8, backgroundColor: temaEscuro ? '#40383C' : '#EFEAE7' }}
                contentFit="cover"
              />
              {modoSelecao && (
                <View className={`absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full ${fotosSelecionadas.includes(index) ? 'bg-memento-danger' : 'bg-black/40'}`}>
                  <Feather name={fotosSelecionadas.includes(index) ? 'check' : 'circle'} size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {processandoFotos && (
        <View className="absolute inset-0 items-center justify-center bg-black/30" pointerEvents="auto">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {album && (
        <>
          <VisualizadorFotos
            visivel={indiceFotoAberta !== null}
            fotos={album.fotos}
            indiceInicial={indiceFotoAberta ?? 0}
            aoFechar={() => setIndiceFotoAberta(null)}
            aoRemover={(indice) => confirmarRemocao([indice])}
          />

          <FolhaAcoes
            visivel={adicionarFotoVisivel}
            titulo="Adicionar fotos"
            alturaFracao={0.32}
            opcoes={opcoesAdicionarFoto}
            aoFechar={() => setAdicionarFotoVisivel(false)}
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
            link={linkConvite}
            erro={erroConvite}
            aoFechar={() => setQrCodeVisivel(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}
