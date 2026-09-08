import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  iconName?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  mensagemErro?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ iconName, isPassword, mensagemErro, containerStyle, style, ...rest }: InputProps) {
  const [isSecure, setIsSecure] = useState(isPassword);
  const temErro = Boolean(mensagemErro);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.container, temErro && styles.containerComErro]}>
        {iconName && (
          <Feather name={iconName} size={20} color="#4A3A35" style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#B0A6A4"
          secureTextEntry={isSecure}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.eyeIcon}>
            <Feather name={isSecure ? "eye-off" : "eye"} size={20} color="#4A3A35" />
          </TouchableOpacity>
        )}
      </View>
      {temErro && <Text style={styles.textoErro}>{mensagemErro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#EFEAE7',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  containerComErro: {
    borderColor: '#E0637A',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4A3A35',
  },
  eyeIcon: {
    padding: 4,
  },
  textoErro: {
    color: '#E0637A',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
