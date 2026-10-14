import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TelaInicial() {
  const { width: largura } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas" edges={["top", "bottom"]}>
      {/* Fundo Ondulado (Wave) fixo na parte inferior */}
      <View className="absolute bottom-0 left-0 right-0 z-0" pointerEvents="none">
        <Svg
          height="120"
          width={largura}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <Path
            fill="#FBE7E9"
            fillOpacity="1"
            d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,240C672,235,768,245,864,250.7C960,256,1056,256,1152,240C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </Svg>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center px-6">
          {/* Seção Gráfica do Cabeçalho */}
          <View className="relative z-10 mt-2 h-[180px] items-center justify-center">
            {/* Polaroid Esquerda */}
            <View className="absolute left-0 top-5 -rotate-12 bg-white p-2 pb-6 shadow-md">
              <Image
                source="https://picsum.photos/seed/sunset/200/250"
                style={{ width: 90, height: 110 }}
                contentFit="cover"
              />
              <Text className="absolute -bottom-2 -left-3 text-[28px]">🌸</Text>
            </View>

            {/* Polaroid Direita */}
            <View className="absolute right-0 top-10 rotate-12 bg-white p-2 pb-6 shadow-md">
              <View className="absolute -right-1 top-[-10px] z-10 h-4 w-7 rotate-[30deg] bg-[#F6BFCF]/85" />
              <Image
                source="https://picsum.photos/seed/field/200/250"
                style={{ width: 90, height: 110 }}
                contentFit="cover"
              />
              <Text className="absolute -bottom-1 -right-2 text-[28px]">🌸</Text>
            </View>

            {/* Nuvem e Coração Central */}
            <View className="z-10 mt-5 items-center justify-center">
              <Ionicons name="cloud-outline" size={100} color="#4A3A35" />
              <View className="absolute top-11 rounded-2xl bg-memento-canvas p-1">
                <Ionicons name="heart-outline" size={38} color="#F29CBA" />
              </View>
            </View>
          </View>

          {/* Textos */}
          <View className="z-10 mb-6 mt-5 items-center">
            <Text className="mb-2 text-2xl font-bold text-memento-ink">Guarde o que importa.</Text>
            <Text className="text-sm text-[#666666]">
              Compartilhe momentos. Crie{" "}
              <Text className="font-bold text-memento-ink">memórias.</Text>
            </Text>
          </View>

          {/* Cartão do Formulário */}
          <View className="z-10 rounded-3xl bg-white p-6 shadow-lg shadow-black/5">
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input iconName="lock" placeholder="Senha" isPassword />

            <TouchableOpacity className="mb-6 self-end">
              <Text className="text-sm font-medium text-sky-500">
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              className="mb-6"
              onPress={() => router.replace("/home")}
            />

            <View className="flex-row items-center justify-center">
              <Text className="text-sm text-memento-muted">Ainda não tem uma conta? </Text>
              <Link href="/criar-conta" asChild>
                <TouchableOpacity>
                  <Text className="text-sm font-semibold text-sky-500">Criar conta</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Espaçador flexível para empurrar o conteúdo quando necessário */}
          <View className="h-5" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
