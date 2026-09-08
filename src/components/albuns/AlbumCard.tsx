import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { Album } from '@/contexts/albuns-context';

interface AlbumCardProps {
  album: Album;
  aoAlternarFavorito: (id: string) => void;
}

export function AlbumCard({ album, aoAlternarFavorito }: AlbumCardProps) {
  return (
    <Pressable style={estilos.container} onPress={() => router.push(`/album/${album.id}`)}>
      <Image source={album.capa} style={estilos.capa} contentFit="cover" />

      <TouchableOpacity
        style={estilos.botaoFavorito}
        onPress={() => aoAlternarFavorito(album.id)}
        hitSlop={8}
      >
        <Ionicons
          name={album.favorito ? 'star' : 'star-outline'}
          size={18}
          color={album.favorito ? '#F2B705' : '#FFFFFF'}
        />
      </TouchableOpacity>

      <View style={estilos.rodapeNome}>
        <Text style={estilos.nome} numberOfLines={1}>
          {album.nome}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EFEAE7',
  },
  capa: {
    width: '100%',
    height: '100%',
  },
  botaoFavorito: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 58, 53, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rodapeNome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(74, 58, 53, 0.45)',
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
