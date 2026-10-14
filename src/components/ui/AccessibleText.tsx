import { StyleSheet, Text as NativeText, type TextProps, type TextStyle } from 'react-native';

import { useAccessibilityPreferences } from '@/contexts/accessibility-context';

const TAMANHOS_MAIORES: Record<string, string> = {
  'text-xs': 'text-sm',
  'text-sm': 'text-base',
  'text-base': 'text-lg',
  'text-lg': 'text-xl',
  'text-xl': 'text-2xl',
  'text-2xl': 'text-3xl',
  'text-3xl': 'text-4xl',
  'text-[13px]': 'text-[16px]',
  'text-[15px]': 'text-[18px]',
  'text-[17px]': 'text-[20px]',
  'text-[22px]': 'text-[26px]',
  'text-[28px]': 'text-[34px]',
};

interface AccessibleTextProps extends TextProps {
  className?: string;
}

export function AccessibleText({ className, style, ...props }: AccessibleTextProps) {
  const { textoMaior } = useAccessibilityPreferences();
  const classesAcessiveis = textoMaior
    ? className?.split(/\s+/).map((classe) => TAMANHOS_MAIORES[classe] ?? classe).join(' ')
    : className;

  let estiloAcessivel = style;
  if (textoMaior) {
    const estiloAtual = StyleSheet.flatten(style);
    if (typeof estiloAtual?.fontSize === 'number') {
      estiloAcessivel = { ...estiloAtual, fontSize: Math.round(estiloAtual.fontSize * 1.2) } as TextStyle;
    }
  }

  return <NativeText {...props} className={classesAcessiveis} style={estiloAcessivel} />;
}
