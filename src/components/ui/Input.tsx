import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  iconName?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
}

export function Input({ iconName, isPassword, style, ...rest }: InputProps) {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={[styles.container, style]}>
      {iconName && (
        <Feather name={iconName} size={20} color="#4A3A35" style={styles.icon} />
      )}
      <TextInput
        style={styles.input}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#EFEAE7',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
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
});
