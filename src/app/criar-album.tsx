import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAlbuns } from '@/features/albums/context/albuns-context';

export default function TelaCriarAlbum() {
  const { criarAlbum } = useAlbuns();
  const [nomeAlbum, setNomeAlbum] = useState('');

  function aoConfirmarNomeAlbum() {
    const nome = nomeAlbum.trim();
    if (!nome) return;
    criarAlbum(nome);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
            <Feather name="x" size={22} color="#4A3A35" />
          </TouchableOpacity>
          <AccessibleText className="text-lg font-bold text-memento-ink">Novo álbum</AccessibleText>
          <View className="w-[22px]" />
        </View>

        <View className="gap-4 px-6">
          <Input placeholder="Nome do álbum" value={nomeAlbum} onChangeText={setNomeAlbum} autoFocus />
          <Button title="Criar álbum" onPress={aoConfirmarNomeAlbum} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
