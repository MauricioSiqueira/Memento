import { useCallback, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AlbumCard } from './AlbumCard';
import type { Album } from '@/features/albums/context/albuns-context';

interface AlbumListScreenProps {
  title: string;
  albums: Album[];
  onToggleFavorite: (id: string) => void;
  emptyMessage?: string;
  onAddAlbum?: () => void;
}

export function AlbumListScreen({
  title,
  albums,
  onToggleFavorite,
  emptyMessage,
  onAddAlbum,
}: AlbumListScreenProps) {
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas" edges={['top']}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="items-center px-6 pb-36 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-5 self-start text-[22px] font-bold text-memento-ink">{title}</Text>

        {albums.length > 0 ? (
          <View className="w-full gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} aoAlternarFavorito={onToggleFavorite} />
            ))}
          </View>
        ) : (
          <Text className="mt-10 text-center text-sm text-memento-muted">{emptyMessage}</Text>
        )}

        {onAddAlbum && (
          <TouchableOpacity
            className="mt-7 h-14 w-14 items-center justify-center rounded-full bg-memento-accent"
            onPress={onAddAlbum}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Criar ou participar de um álbum"
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
