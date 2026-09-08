import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFormularioCadastro, ValoresFormularioCadastro } from '@/hooks/use-formulario-cadastro';
import { TAMANHO_MAXIMO_SENHA } from '@/utils/validacao';

interface FormularioCadastroProps {
  aoCadastrar: (valores: ValoresFormularioCadastro) => void | Promise<void>;
}

export function FormularioCadastro({ aoCadastrar }: FormularioCadastroProps) {
  const { valores, erros, enviando, alterarCampo, submeter } = useFormularioCadastro({ aoCadastrar });

  return (
    <View style={estilos.container}>
      <Input
        iconName="user"
        placeholder="Nome de usuário"
        autoCapitalize="none"
        autoCorrect={false}
        value={valores.nomeUsuario}
        onChangeText={(texto) => alterarCampo('nomeUsuario', texto)}
        mensagemErro={erros.nomeUsuario}
      />

      <Input
        iconName="mail"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={valores.email}
        onChangeText={(texto) => alterarCampo('email', texto)}
        mensagemErro={erros.email}
      />

      <Input
        iconName="lock"
        placeholder="Senha"
        isPassword
        maxLength={TAMANHO_MAXIMO_SENHA}
        value={valores.senha}
        onChangeText={(texto) => alterarCampo('senha', texto)}
        mensagemErro={erros.senha}
      />

      <Input
        iconName="lock"
        placeholder="Confirmar senha"
        isPassword
        maxLength={TAMANHO_MAXIMO_SENHA}
        value={valores.confirmarSenha}
        onChangeText={(texto) => alterarCampo('confirmarSenha', texto)}
        mensagemErro={erros.confirmarSenha}
      />

      <Input
        iconName="calendar"
        placeholder="Data de nascimento (dd/mm/aaaa)"
        keyboardType="number-pad"
        maxLength={10}
        value={valores.dataNascimento}
        onChangeText={(texto) => alterarCampo('dataNascimento', texto)}
        mensagemErro={erros.dataNascimento}
      />

      <Button title="Criar conta" style={estilos.botao} loading={enviando} onPress={submeter} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
  },
  botao: {
    marginTop: 8,
  },
});
