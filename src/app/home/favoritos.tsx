import React, { useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { AlbumCard } from '@/components/albuns/AlbumCard';
import { useAlbuns } from '@/contexts/albuns-context';

export default function TelaFavoritos() {
  const { favoritos, alternarFavorito } = useAlbuns();

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
        <Text style={estilos.titulo}>Álbuns favoritos</Text>

        {favoritos.length === 0 ? (
          <Text style={estilos.textoVazio}>
            Você ainda não favoritou nenhum álbum. Toque na estrela de um álbum para vê-lo aqui.
          </Text>
        ) : (
          <View style={estilos.lista}>
            {favoritos.map((album) => (
              <AlbumCard key={album.id} album={album} aoAlternarFavorito={alternarFavorito} />
            ))}
          </View>
        )}
      </ScrollView>
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
  textoVazio: {
    color: '#6A5A55',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
