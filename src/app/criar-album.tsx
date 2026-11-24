import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAlbuns } from '@/features/albums/context/albuns-context';
import { usePreferences } from '@/contexts/preferences-context';
import { mensagemDeErro } from '@/services/api/erros';

export default function TelaCriarAlbum() {
  const { criarAlbum } = useAlbuns();
  const { temaEscuro } = usePreferences();
  const [nomeAlbum, setNomeAlbum] = useState('');
  const [criando, setCriando] = useState(false);

  async function aoConfirmarNomeAlbum() {
    const nome = nomeAlbum.trim();
    if (!nome || criando) return;

    setCriando(true);
    try {
      await criarAlbum(nome);
      router.back();
    } catch (erro) {
      Alert.alert('Não foi possível criar o álbum', mensagemDeErro(erro));
      setCriando(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas dark:bg-memento-canvas-dark" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
            <Feather name="x" size={22} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
          </TouchableOpacity>
          <AccessibleText className="text-lg font-bold text-memento-ink dark:text-memento-ink-dark">Novo álbum</AccessibleText>
          <View className="w-[22px]" />
        </View>

        <View className="gap-4 px-6">
          <Input placeholder="Nome do álbum" value={nomeAlbum} onChangeText={setNomeAlbum} onSubmitEditing={aoConfirmarNomeAlbum} autoFocus />
          <Button title="Criar álbum" loading={criando} onPress={aoConfirmarNomeAlbum} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
