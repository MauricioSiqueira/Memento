import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { FolhaAcoes, type OpcaoFolhaAcoes } from '@/components/ui/FolhaAcoes';
import { Input } from '@/components/ui/Input';

const COR_SAIR = '#E0637A';

const AVATAR_PADRAO = 'https://picsum.photos/seed/perfil/200/200';

const OPCOES_IMAGEM: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export default function TelaPersonalizacao() {
  const [nome, setNome] = useState('Usuária Memento');
  const [editandoNome, setEditandoNome] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(AVATAR_PADRAO);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [modoDaltonico, setModoDaltonico] = useState(false);
  const [textoMaior, setTextoMaior] = useState(false);

  const [folhaFotoVisivel, setFolhaFotoVisivel] = useState(false);

  function avisarPermissaoNegada(recurso: string) {
    Alert.alert(
      'Permissão necessária',
      `Para trocar sua foto, permita o acesso a ${recurso} nas configurações do dispositivo.`,
      [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
      ]
    );
  }

  async function aoEscolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      avisarPermissaoNegada('suas fotos');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync(OPCOES_IMAGEM);
    if (!resultado.canceled && resultado.assets[0]) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  }

  async function aoTirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      avisarPermissaoNegada('a câmera');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync(OPCOES_IMAGEM);
    if (!resultado.canceled && resultado.assets[0]) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  }

  function aoDeletarFoto() {
    setFotoPerfil(AVATAR_PADRAO);
  }

  const opcoesFotoPerfil: OpcaoFolhaAcoes[] = [
    {
      chave: 'tirar-foto',
      rotulo: 'Tirar foto',
      icone: { familia: 'feather', nome: 'camera' },
      aoSelecionar: aoTirarFoto,
    },
    {
      chave: 'escolher-galeria',
      rotulo: 'Escolher da galeria',
      icone: { familia: 'feather', nome: 'image' },
      aoSelecionar: aoEscolherDaGaleria,
    },
    {
      chave: 'deletar-foto',
      rotulo: 'Deletar foto',
      icone: { familia: 'feather', nome: 'trash-2' },
      aoSelecionar: aoDeletarFoto,
      destrutiva: true,
    },
  ];

  function aoSairDaConta() {
    Alert.alert('Sair da conta', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => router.replace('/') },
    ]);
  }

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>Personalização</Text>

        <View style={estilos.containerPerfil}>
          <View style={estilos.containerAvatar}>
            <Image source={fotoPerfil} style={estilos.avatar} contentFit="cover" />
            <TouchableOpacity
              style={estilos.botaoEditarFoto}
              onPress={() => setFolhaFotoVisivel(true)}
              hitSlop={8}
            >
              <Feather name="edit-2" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {editandoNome ? (
            <View style={estilos.containerEdicaoNome}>
              <Input
                value={nome}
                onChangeText={setNome}
                autoFocus
                containerStyle={estilos.inputNome}
              />
              <TouchableOpacity onPress={() => setEditandoNome(false)}>
                <Text style={estilos.acaoSalvarNome}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={estilos.containerNome} onPress={() => setEditandoNome(true)}>
              <Text style={estilos.nome}>{nome}</Text>
              <Feather name="edit-2" size={14} color="#8A7A75" />
            </TouchableOpacity>
          )}
        </View>

        <View style={estilos.cartao}>
          <LinhaConfiguracao titulo="Tema escuro" valor={temaEscuro} aoAlterar={setTemaEscuro} />
          <LinhaConfiguracao titulo="Modo daltônico" valor={modoDaltonico} aoAlterar={setModoDaltonico} />
          <LinhaConfiguracao
            titulo="Texto maior (acessibilidade)"
            valor={textoMaior}
            aoAlterar={setTextoMaior}
            ultima
          />
        </View>

        <TouchableOpacity style={estilos.botaoSair} onPress={aoSairDaConta}>
          <Feather name="log-out" size={18} color={COR_SAIR} />
          <Text style={estilos.textoSair}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <FolhaAcoes
        visivel={folhaFotoVisivel}
        titulo="Alterar foto de perfil"
        alturaFracao={0.5}
        opcoes={opcoesFotoPerfil}
        aoFechar={() => setFolhaFotoVisivel(false)}
      />
    </SafeAreaView>
  );
}

interface LinhaConfiguracaoProps {
  titulo: string;
  valor: boolean;
  aoAlterar: (valor: boolean) => void;
  ultima?: boolean;
}

function LinhaConfiguracao({ titulo, valor, aoAlterar, ultima }: LinhaConfiguracaoProps) {
  return (
    <View style={[estilos.linha, !ultima && estilos.linhaComDivisor]}>
      <Text style={estilos.linhaTitulo}>{titulo}</Text>
      <Switch
        value={valor}
        onValueChange={aoAlterar}
        trackColor={{ false: '#EFEAE7', true: '#F29CBA' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  conteudo: {
    padding: 24,
    paddingBottom: 140,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A3A35',
    marginBottom: 24,
  },
  containerPerfil: {
    alignItems: 'center',
    marginBottom: 32,
  },
  containerAvatar: {
    width: 96,
    height: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EFEAE7',
  },
  botaoEditarFoto: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F29CBA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FAF5F2',
  },
  containerNome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  nome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3A35',
  },
  containerEdicaoNome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  inputNome: {
    flex: 1,
    marginBottom: 0,
  },
  acaoSalvarNome: {
    color: '#F29CBA',
    fontSize: 14,
    fontWeight: '600',
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  linhaComDivisor: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEAE7',
  },
  linhaTitulo: {
    fontSize: 15,
    color: '#4A3A35',
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 16,
  },
  textoSair: {
    color: COR_SAIR,
    fontSize: 15,
    fontWeight: '600',
  },
});
