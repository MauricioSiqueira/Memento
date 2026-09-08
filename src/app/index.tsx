import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialButton } from '@/components/ui/SocialButton';

export default function TelaInicial() {
  const { width: largura } = useWindowDimensions();

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <ScrollView contentContainerStyle={estilos.conteudoScroll} showsVerticalScrollIndicator={false}>
        
        {/* Seção Gráfica do Cabeçalho */}
        <View style={estilos.graficosCabecalho}>
          {/* Polaroid Esquerda */}
          <View style={[estilos.polaroid, estilos.polaroidEsquerda]}>
            <Image 
              source="https://picsum.photos/seed/sunset/200/250" 
              style={estilos.imagemPolaroid} 
              contentFit="cover"
            />
          </View>
          
          {/* Polaroid Direita */}
          <View style={[estilos.polaroid, estilos.polaroidDireita]}>
            <Image 
              source="https://picsum.photos/seed/field/200/250" 
              style={estilos.imagemPolaroid} 
              contentFit="cover"
            />
          </View>

          {/* Nuvem e Coração Central */}
          <View style={estilos.containerLogo}>
            <Feather name="cloud" size={80} color="#4A3A35" />
            <View style={estilos.containerCoracao}>
              <Feather name="heart" size={32} color="#F29CBA" />
            </View>
          </View>
        </View>

        {/* Textos */}
        <View style={estilos.containerTexto}>
          <Text style={estilos.titulo}>Guarde o que importa.</Text>
          <Text style={estilos.subtitulo}>
            Compartilhe momentos. Crie <Text style={estilos.destaqueSubtitulo}>memórias.</Text>
          </Text>
        </View>

        {/* Cartão do Formulário */}
        <View style={estilos.cartao}>
          <Input 
            iconName="mail"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            iconName="lock"
            placeholder="Senha"
            isPassword
          />
          
          <TouchableOpacity style={estilos.containerEsqueceuSenha}>
            <Text style={estilos.textoEsqueceuSenha}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <Button title="Entrar" style={estilos.botaoEntrar} />

          <View style={estilos.containerDivisor}>
            <View style={estilos.divisor} />
            <Text style={estilos.textoDivisor}>ou entre com</Text>
            <View style={estilos.divisor} />
          </View>

          <View style={estilos.containerBotoesSociais}>
            <SocialButton title="Google" iconName="google" style={estilos.botaoSocialEsq} />
            <SocialButton title="Apple" iconName="apple1" style={estilos.botaoSocialDir} />
          </View>

          <View style={estilos.containerRodape}>
            <Text style={estilos.textoRodape}>Ainda não tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={estilos.acaoRodape}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fundo Ondulado (Wave) */}
      <View style={estilos.containerOnda} pointerEvents="none">
        <Svg height="120" width={largura} viewBox="0 0 1440 320">
          <Path
            fill="#FBE7E9"
            fillOpacity="1"
            d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,240C672,235,768,245,864,250.7C960,256,1056,256,1152,240C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </Svg>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  conteudoScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  graficosCabecalho: {
    height: 200,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  polaroid: {
    position: 'absolute',
    backgroundColor: '#FFF',
    padding: 8,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  polaroidEsquerda: {
    left: -10,
    top: 20,
    transform: [{ rotate: '-12deg' }],
  },
  polaroidDireita: {
    right: -10,
    top: 40,
    transform: [{ rotate: '12deg' }],
  },
  imagemPolaroid: {
    width: 110,
    height: 130,
  },
  containerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: 20,
  },
  containerCoracao: {
    position: 'absolute',
    top: 35,
  },
  containerTexto: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A3A35',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#666666',
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
    zIndex: 10,
  },
  containerEsqueceuSenha: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  textoEsqueceuSenha: {
    color: '#F29CBA',
    fontSize: 14,
    fontWeight: '500',
  },
  botaoEntrar: {
    marginBottom: 32,
  },
  containerDivisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#EFEAE7',
  },
  textoDivisor: {
    color: '#8A7A75',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  containerBotoesSociais: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  botaoSocialEsq: {
    marginRight: 8,
  },
  botaoSocialDir: {
    marginLeft: 8,
  },
  containerRodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  containerOnda: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
