import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormularioCadastro } from "@/features/auth/components/FormularioCadastro";
import type { ValoresFormularioCadastro } from "@/features/auth/hooks/use-formulario-cadastro";

export default function TelaCriarConta() {
  async function aoCadastrar(valores: ValoresFormularioCadastro) {
    Alert.alert("Conta criada", `Bem-vindo(a), ${valores.nomeUsuario}!`, [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas" edges={["top", "bottom"]}>
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
            <Feather name="arrow-left" size={22} color="#4A3A35" />
          </TouchableOpacity>

          <View className="mb-6 mt-3">
            <Text className="mb-2 text-2xl font-bold text-memento-ink">Crie sua conta</Text>
            <Text className="text-sm leading-5 text-[#666666]">
              Preencha os dados abaixo para começar a{" "}
              <Text className="font-bold text-memento-ink">
                guardar suas memórias.
              </Text>
            </Text>
          </View>

          <View className="rounded-3xl bg-white p-6 shadow-lg shadow-black/5">
            <FormularioCadastro aoCadastrar={aoCadastrar} />
          </View>

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-sm text-memento-muted">Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-sm font-semibold text-sky-500">Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
