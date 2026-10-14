import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FolhaAcoes, type OpcaoFolhaAcoes } from "@/components/ui/FolhaAcoes";
import { Input } from "@/components/ui/Input";

const COR_SAIR = "#E0637A";

const AVATAR_PADRAO = "https://picsum.photos/seed/perfil/200/200";

const OPCOES_IMAGEM: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export default function TelaPersonalizacao() {
  const [nome, setNome] = useState("Usuária Memento");
  const [editandoNome, setEditandoNome] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(AVATAR_PADRAO);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [modoDaltonico, setModoDaltonico] = useState(false);
  const [textoMaior, setTextoMaior] = useState(false);

  const [folhaFotoVisivel, setFolhaFotoVisivel] = useState(false);

  function avisarPermissaoNegada(recurso: string) {
    Alert.alert(
      "Permissão necessária",
      `Para trocar sua foto, permita o acesso a ${recurso} nas configurações do dispositivo.`,
      [
        { text: "Agora não", style: "cancel" },
        { text: "Abrir configurações", onPress: () => Linking.openSettings() },
      ],
    );
  }

  async function aoEscolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      avisarPermissaoNegada("suas fotos");
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
      avisarPermissaoNegada("a câmera");
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
      chave: "tirar-foto",
      rotulo: "Tirar foto",
      icone: { familia: "feather", nome: "camera" },
      aoSelecionar: aoTirarFoto,
    },
    {
      chave: "escolher-galeria",
      rotulo: "Escolher da galeria",
      icone: { familia: "feather", nome: "image" },
      aoSelecionar: aoEscolherDaGaleria,
    },
    {
      chave: "deletar-foto",
      rotulo: "Deletar foto",
      icone: { familia: "feather", nome: "trash-2" },
      aoSelecionar: aoDeletarFoto,
      destrutiva: true,
    },
  ];

  function aoSairDaConta() {
    Alert.alert("Sair da conta", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-6 pb-36 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-[22px] font-bold text-memento-ink">
          Personalização
        </Text>

        <View className="mb-8 items-center">
          <View className="h-24 w-24">
            <Image
              source={fotoPerfil}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "#EFEAE7",
              }}
              contentFit="cover"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-memento-canvas bg-memento-accent"
              onPress={() => setFolhaFotoVisivel(true)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Alterar foto de perfil"
            >
              <Feather name="edit-2" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {editandoNome ? (
            <View className="mt-4 w-full max-w-xs flex-row items-center justify-center gap-3">
              <Input
                value={nome}
                onChangeText={setNome}
                autoFocus
                containerStyle={{ flex: 1, marginBottom: 0 }}
              />
              <TouchableOpacity onPress={() => setEditandoNome(false)}>
                <Text className="text-sm font-semibold text-memento-accent">
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="mt-4 flex-row items-center justify-center gap-2"
              onPress={() => setEditandoNome(true)}
            >
              <Text className="text-lg font-semibold text-memento-ink">
                {nome}
              </Text>
              <Feather name="edit-2" size={14} color="#8A7A75" />
            </TouchableOpacity>
          )}
        </View>

        <View className="rounded-3xl bg-white px-5 shadow-lg shadow-black/5">
          <LinhaConfiguracao
            titulo="Tema escuro"
            valor={temaEscuro}
            aoAlterar={setTemaEscuro}
          />
          <LinhaConfiguracao
            titulo="Modo daltônico"
            valor={modoDaltonico}
            aoAlterar={setModoDaltonico}
          />
          <LinhaConfiguracao
            titulo="Texto maior (acessibilidade)"
            valor={textoMaior}
            aoAlterar={setTextoMaior}
            ultima
          />
        </View>

        <TouchableOpacity
          className="mt-6 flex-row items-center justify-center gap-2 py-4"
          onPress={aoSairDaConta}
        >
          <Feather name="log-out" size={18} color={COR_SAIR} />
          <Text className="text-[15px] font-semibold text-memento-danger">
            Sair da conta
          </Text>
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

function LinhaConfiguracao({
  titulo,
  valor,
  aoAlterar,
  ultima,
}: LinhaConfiguracaoProps) {
  return (
    <View
      className={`flex-row items-center justify-between py-[18px] ${ultima ? "" : "border-b border-memento-line"}`}
    >
      <Text className="text-[15px] text-memento-ink">{titulo}</Text>
      <Switch
        value={valor}
        onValueChange={aoAlterar}
        trackColor={{ false: "#EFEAE7", true: "#F29CBA" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
