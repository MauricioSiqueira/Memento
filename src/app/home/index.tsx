import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AlbumCard } from '@/components/albuns/AlbumCard';
import { FolhaAcoes } from '@/components/ui/FolhaAcoes';
import { useAlbuns } from '@/contexts/albuns-context';
import { criarOpcoesNovoAlbum } from '@/utils/opcoes-criar-album';

export default function TelaAlbuns() {
  const { albuns, alternarFavorito } = useAlbuns();
  const [folhaVisivel, setFolhaVisivel] = useState(false);
  const opcoesCriarAlbum = useMemo(() => criarOpcoesNovoAlbum(), []);

  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.titulo}>Seus álbuns</Text>

        <View style={estilos.lista}>
          {albuns.map((album) => (
            <AlbumCard key={album.id} album={album} aoAlternarFavorito={alternarFavorito} />
          ))}
        </View>

        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => setFolhaVisivel(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      <FolhaAcoes
        visivel={folhaVisivel}
        titulo="Novo álbum"
        alturaFracao={0.25}
        opcoes={opcoesCriarAlbum}
        aoFechar={() => setFolhaVisivel(false)}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  conteudo: {
    padding: 24,
    paddingBottom: 140,
    alignItems: 'center',
  },
  titulo: {
    alignSelf: 'flex-start',
    fontSize: 22,
    fontWeight: '700',
    color: '#4A3A35',
    marginBottom: 20,
  },
  lista: {
    width: '100%',
    gap: 16,
  },
  botaoAdicionar: {
    marginTop: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F29CBA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F29CBA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
});
