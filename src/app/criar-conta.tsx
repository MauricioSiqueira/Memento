import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { AccessibleText } from "@/components/ui/AccessibleText";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormularioCadastro } from "@/features/auth/components/FormularioCadastro";
import type {
  CampoFormularioCadastro,
  ErrosFormularioCadastro,
  ValoresFormularioCadastro,
} from "@/features/auth/hooks/use-formulario-cadastro";
import { useAuth } from "@/features/auth/context/auth-context";
import { usePreferences } from "@/contexts/preferences-context";
import { ApiError, mensagemDeErro } from "@/services/api/erros";

const CAMPOS_DO_FORMULARIO: CampoFormularioCadastro[] = [
  "nomeUsuario",
  "email",
  "senha",
  "confirmarSenha",
  "dataNascimento",
];

/** "dd/mm/aaaa" (formato digitado) -> "aaaa-mm-dd" (formato da API). */
function dataParaApi(dataTextual: string): string {
  const [dia, mes, ano] = dataTextual.split("/");
  return `${ano}-${mes}-${dia}`;
}

export default function TelaCriarConta() {
  const { temaEscuro } = usePreferences();
  const { cadastrar } = useAuth();

  async function aoCadastrar(valores: ValoresFormularioCadastro): Promise<ErrosFormularioCadastro | void> {
    try {
      await cadastrar({
        nomeUsuario: valores.nomeUsuario.trim(),
        email: valores.email.trim(),
        senha: valores.senha,
        confirmarSenha: valores.confirmarSenha,
        dataNascimento: dataParaApi(valores.dataNascimento),
      });
    } catch (erro) {
      // Erros de validação/conflito por campo aparecem no próprio campo.
      if (erro instanceof ApiError && Object.keys(erro.campos).length > 0) {
        const errosDosCampos: ErrosFormularioCadastro = {};
        for (const campo of CAMPOS_DO_FORMULARIO) {
          if (erro.campos[campo]) errosDosCampos[campo] = erro.campos[campo];
        }
        if (Object.keys(errosDosCampos).length > 0) return errosDosCampos;
      }
      Alert.alert("Não foi possível criar a conta", mensagemDeErro(erro));
      return;
    }

    Alert.alert("Conta criada", `Bem-vindo(a), ${valores.nomeUsuario}! Agora é só entrar.`, [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas dark:bg-memento-canvas-dark" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="grow px-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            className="mt-2 h-10 w-10 justify-center"
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Feather name="arrow-left" size={22} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
          </TouchableOpacity>

          <View className="mb-6 mt-3">
            <AccessibleText className="mb-2 text-2xl font-bold text-memento-ink dark:text-memento-ink-dark">Crie sua conta</AccessibleText>
            <AccessibleText className="text-sm leading-5 text-[#666666] dark:text-memento-muted-dark">
              Preencha os dados abaixo para começar a{" "}
              <AccessibleText className="font-bold text-memento-ink dark:text-memento-ink-dark">
                guardar suas memórias.
              </AccessibleText>
            </AccessibleText>
          </View>

          <View className="rounded-3xl bg-white p-6 shadow-lg shadow-black/5 dark:bg-memento-surface-dark">
            <FormularioCadastro aoCadastrar={aoCadastrar} />
          </View>

          <View className="mt-6 flex-row items-center justify-center">
            <AccessibleText className="text-sm text-memento-muted dark:text-memento-muted-dark">Já tem uma conta? </AccessibleText>
            <TouchableOpacity onPress={() => router.back()}>
              <AccessibleText className="text-sm font-semibold text-sky-500">Entrar</AccessibleText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
