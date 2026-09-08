import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface SocialButtonProps extends TouchableOpacityProps {
  title: string;
  iconName: React.ComponentProps<typeof AntDesign>['name'];
}

export function SocialButton({ title, iconName, style, ...rest }: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      {...rest}
    >
      <AntDesign name={iconName} size={24} color="#4A3A35" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEAE7',
    borderRadius: 16,
    height: 56,
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    color: '#4A3A35',
    fontSize: 16,
    fontWeight: '500',
  },
});
