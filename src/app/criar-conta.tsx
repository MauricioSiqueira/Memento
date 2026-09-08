import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { FormularioCadastro } from '@/components/auth/FormularioCadastro';
import type { ValoresFormularioCadastro } from '@/hooks/use-formulario-cadastro';

export default function TelaCriarConta() {
  async function aoCadastrar(valores: ValoresFormularioCadastro) {
    Alert.alert('Conta criada', `Bem-vindo(a), ${valores.nomeUsuario}!`, [
      { text: 'OK', onPress: () => router.replace('/') },
    ]);
  }

  return (
    <SafeAreaView style={estilos.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={estilos.tecladoContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudoRolagem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color="#4A3A35" />
          </TouchableOpacity>

          <View style={estilos.containerTexto}>
            <Text style={estilos.titulo}>Crie sua conta</Text>
            <Text style={estilos.subtitulo}>
              Preencha os dados abaixo para começar a{' '}
              <Text style={estilos.destaqueSubtitulo}>guardar suas memórias.</Text>
            </Text>
          </View>

          <View style={estilos.cartao}>
            <FormularioCadastro aoCadastrar={aoCadastrar} />
          </View>

          <View style={estilos.containerRodape}>
            <Text style={estilos.textoRodape}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={estilos.acaoRodape}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  tecladoContainer: {
    flex: 1,
  },
  conteudoRolagem: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  botaoVoltar: {
    marginTop: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  containerTexto: {
    marginTop: 12,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A3A35',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  destaqueSubtitulo: {
    color: '#F29CBA',
    fontWeight: '500',
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  containerRodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  textoRodape: {
    color: '#6A5A55',
    fontSize: 14,
  },
  acaoRodape: {
    color: '#F29CBA',
    fontSize: 14,
    fontWeight: '600',
  },
});
