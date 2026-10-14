import React, { useState } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { usePreferences } from '@/contexts/preferences-context';

interface InputProps extends TextInputProps {
  iconName?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  mensagemErro?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ iconName, isPassword, mensagemErro, containerStyle, style, ...rest }: InputProps) {
  const [isSecure, setIsSecure] = useState(isPassword);
  const { textoMaior, temaEscuro } = usePreferences();
  const temErro = Boolean(mensagemErro);

  return (
    <View className="mb-4" style={containerStyle}>
      <View className={`h-14 flex-row items-center rounded-2xl border bg-memento-canvas px-4 dark:bg-memento-surface-dark ${temErro ? 'border-memento-danger' : 'border-memento-line dark:border-memento-line-dark'}`}>
        {iconName && (
          <Feather name={iconName} size={20} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} style={{ marginRight: 12 }} />
        )}
        <TextInput
          className={`flex-1 ${textoMaior ? 'text-lg' : 'text-base'} text-memento-ink dark:text-memento-ink-dark`}
          style={style}
          placeholderTextColor={temaEscuro ? '#A99DA2' : '#B0A6A4'}
          secureTextEntry={isSecure}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} className="p-1" accessibilityRole="button" accessibilityLabel={isSecure ? 'Mostrar senha' : 'Ocultar senha'}>
            <Feather name={isSecure ? "eye-off" : "eye"} size={20} color={temaEscuro ? '#FFF8F6' : '#4A3A35'} />
          </TouchableOpacity>
        )}
      </View>
      {temErro && <AccessibleText className="ml-1 mt-1.5 text-xs text-memento-danger">{mensagemErro}</AccessibleText>}
    </View>
  );
}
