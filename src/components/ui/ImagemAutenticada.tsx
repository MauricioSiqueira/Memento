import { Image, type ImageProps } from 'expo-image';
import React, { useMemo } from 'react';

import { useAuth } from '@/features/auth/context/auth-context';
import { API_URL } from '@/services/api/config';

interface ImagemAutenticadaProps extends Omit<ImageProps, 'source'> {
  /** Caminho devolvido pela API (ex.: `/api/arquivos/{id}`). */
  url?: string | null;
  /** Imagem exibida quando não há `url` (ex.: avatar padrão). */
  fonteAlternativa?: string;
}

/**
 * `Image` para arquivos da API: o container de blobs é privado, então a requisição leva o
 * Bearer token. O `cacheKey` é o próprio caminho (o id do arquivo é um GUID imutável), para que
 * a renovação do token a cada 15 min não invalide o cache em disco.
 */
export function ImagemAutenticada({ url, fonteAlternativa, ...props }: ImagemAutenticadaProps) {
  const { accessToken } = useAuth();

  const fonte = useMemo(() => {
    if (!url) return fonteAlternativa ?? null;
    if (!accessToken) return null;
    return { uri: `${API_URL}${url}`, headers: { Authorization: `Bearer ${accessToken}` }, cacheKey: url };
  }, [url, fonteAlternativa, accessToken]);

  return <Image {...props} source={fonte} />;
}
