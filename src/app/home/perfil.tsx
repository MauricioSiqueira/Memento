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
  TouchableOpacity,
  View,
} from "react-native";

import { AccessibleText } from "@/components/ui/AccessibleText";
import { SafeAreaView } from "react-native-safe-area-context";

import { FolhaAcoes, type OpcaoFolhaAcoes } from "@/components/ui/FolhaAcoes";
import { Input } from "@/components/ui/Input";
import { usePreferences } from "@/contexts/preferences-context";

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
  const [modoDaltonico, setModoDaltonico] = useState(false);
  const { temaEscuro, setTemaEscuro, textoMaior, setTextoMaior } = usePreferences();

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
    <SafeAreaView className="flex-1 bg-memento-canvas dark:bg-memento-canvas-dark" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-6 pb-36 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <AccessibleText className="mb-6 text-[22px] font-bold text-memento-ink dark:text-memento-ink-dark">
          Personalização
        </AccessibleText>

        <View className="mb-8 items-center">
          <View className="h-24 w-24">
            <Image
              source={fotoPerfil}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: temaEscuro ? "#40383C" : "#EFEAE7",
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
              <AccessibleText className="text-sm font-semibold text-memento-accent">
                  Salvar
                </AccessibleText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="mt-4 flex-row items-center justify-center gap-2"
              onPress={() => setEditandoNome(true)}
            >
              <AccessibleText className="text-lg font-semibold text-memento-ink dark:text-memento-ink-dark">
                {nome}
              </AccessibleText>
              <Feather name="edit-2" size={14} color={temaEscuro ? "#C9BCB8" : "#8A7A75"} />
            </TouchableOpacity>
          )}
        </View>

        <View className="rounded-3xl bg-white px-5 shadow-lg shadow-black/5 dark:bg-memento-surface-dark">
          <LinhaConfiguracao
            titulo="Tema escuro"
            valor={temaEscuro}
            aoAlterar={setTemaEscuro}
            temaEscuro={temaEscuro}
          />
          <LinhaConfiguracao
            titulo="Modo daltônico"
            valor={modoDaltonico}
            aoAlterar={setModoDaltonico}
            temaEscuro={temaEscuro}
          />
          <LinhaConfiguracao
            titulo="Texto maior (acessibilidade)"
            valor={textoMaior}
            aoAlterar={setTextoMaior}
            temaEscuro={temaEscuro}
            ultima
          />
        </View>

        <TouchableOpacity
          className="mt-6 flex-row items-center justify-center gap-2 py-4"
          onPress={aoSairDaConta}
        >
          <Feather name="log-out" size={18} color={COR_SAIR} />
          <AccessibleText className="text-[15px] font-semibold text-memento-danger">
            Sair da conta
          </AccessibleText>
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
  temaEscuro: boolean;
  ultima?: boolean;
}

function LinhaConfiguracao({
  titulo,
  valor,
  aoAlterar,
  temaEscuro,
  ultima,
}: LinhaConfiguracaoProps) {
  return (
    <View
      className={`flex-row items-center justify-between py-[18px] ${ultima ? "" : "border-b border-memento-line dark:border-memento-line-dark"}`}
    >
      <AccessibleText className="text-[15px] text-memento-ink dark:text-memento-ink-dark">{titulo}</AccessibleText>
      <Switch
        value={valor}
        onValueChange={aoAlterar}
        trackColor={{ false: temaEscuro ? "#40383C" : "#EFEAE7", true: "#F29CBA" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
