import { useCallback, useRef } from 'react';
import { RefreshControl, ScrollView, type ScrollViewInstance, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { AlbumCard } from './AlbumCard';
import type { Album } from '@/features/albums/context/albuns-context';
import { usePreferences } from '@/contexts/preferences-context';

interface AlbumListScreenProps {
  title: string;
  albums: Album[];
  onToggleFavorite: (id: string) => void;
  emptyMessage?: string;
  onAddAlbum?: () => void;
  /** Mensagem de erro do carregamento, exibida no lugar da lista vazia. */
  error?: string | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function AlbumListScreen({
  title,
  albums,
  onToggleFavorite,
  emptyMessage,
  onAddAlbum,
  error,
  refreshing = false,
  onRefresh,
}: AlbumListScreenProps) {
  const { modoDaltonico } = usePreferences();
  const scrollRef = useRef<ScrollViewInstance>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-memento-canvas dark:bg-memento-canvas-dark" edges={['top']}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="items-center px-6 pb-36 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
      >
        <AccessibleText className="mb-5 self-start text-[22px] font-bold text-memento-ink dark:text-memento-ink-dark">{title}</AccessibleText>

        {albums.length > 0 ? (
          <View className="w-full gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} aoAlternarFavorito={onToggleFavorite} />
            ))}
          </View>
        ) : error ? (
          <View className="mt-10 items-center gap-3">
            <AccessibleText className="text-center text-sm text-memento-muted dark:text-memento-muted-dark">{error}</AccessibleText>
            {onRefresh && (
              <TouchableOpacity onPress={onRefresh} accessibilityRole="button">
                <AccessibleText className="text-sm font-semibold text-sky-500">Tentar novamente</AccessibleText>
              </TouchableOpacity>
            )}
          </View>
        ) : refreshing ? null : (
          <AccessibleText className="mt-10 text-center text-sm text-memento-muted dark:text-memento-muted-dark">{emptyMessage}</AccessibleText>
        )}

        {onAddAlbum && (
          <TouchableOpacity
            className={`mt-7 h-14 w-14 items-center justify-center rounded-full ${modoDaltonico ? 'bg-memento-accessible-accent' : 'bg-memento-accent'}`}
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
