import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAlbuns } from '@/contexts/albuns-context';

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
    <SafeAreaView style={estilos.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={estilos.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Feather name="x" size={22} color="#4A3A35" />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Novo álbum</Text>
          <View style={estilos.espacoCabecalho} />
        </View>

        <View style={estilos.conteudo}>
          <Input placeholder="Nome do álbum" value={nomeAlbum} onChangeText={setNomeAlbum} autoFocus />
          <Button title="Criar álbum" onPress={aoConfirmarNomeAlbum} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  teclado: {
    flex: 1,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3A35',
  },
  espacoCabecalho: {
    width: 22,
  },
  conteudo: {
    paddingHorizontal: 24,
    gap: 16,
  },
});
