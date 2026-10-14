import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  className?: string;
}

export function Button({ title, loading, style, className, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`h-14 w-full items-center justify-center rounded-full bg-memento-accent active:opacity-80 ${className ?? ''}`}
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
        <Text className="text-lg font-semibold text-white">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
