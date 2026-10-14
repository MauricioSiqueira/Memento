import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { Album } from '@/features/albums/context/albuns-context';

interface AlbumCardProps {
  album: Album;
  aoAlternarFavorito: (id: string) => void;
}

export function AlbumCard({ album, aoAlternarFavorito }: AlbumCardProps) {
  return (
    <Pressable className="relative aspect-[2/1] w-full overflow-hidden rounded-[20px] bg-memento-line" onPress={() => router.push(`/album/${album.id}`)}>
      <Image source={album.capa} style={{ width: '100%', height: '100%' }} contentFit="cover" />

      <TouchableOpacity
        className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-[#4A3A35]/45"
        accessibilityRole="button"
        accessibilityLabel={album.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        onPress={() => aoAlternarFavorito(album.id)}
        hitSlop={8}
      >
        <Ionicons
          name={album.favorito ? 'star' : 'star-outline'}
          size={18}
          color={album.favorito ? '#F2B705' : '#FFFFFF'}
        />
      </TouchableOpacity>

      <View className="absolute bottom-0 left-0 right-0 bg-[#4A3A35]/45 px-4 py-3">
        <Text className="text-base font-bold text-white" numberOfLines={1}>
          {album.nome}
        </Text>
      </View>
    </Pressable>
  );
}
