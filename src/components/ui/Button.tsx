import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { usePreferences } from '@/contexts/preferences-context';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  className?: string;
}

export function Button({ title, loading, style, className, ...rest }: ButtonProps) {
  const { modoDaltonico } = usePreferences();
  return (
    <TouchableOpacity
      className={`h-14 w-full items-center justify-center rounded-full ${modoDaltonico ? 'bg-memento-accessible-accent' : 'bg-memento-accent'} active:opacity-80 ${className ?? ''}`}
      style={style}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(rest.disabled || loading), busy: Boolean(loading) }}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <AccessibleText className="text-lg font-semibold text-white">{title}</AccessibleText>
      )}
    </TouchableOpacity>
  );
}
