import React from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

import { AccessibleText } from '@/components/ui/AccessibleText';
import { usePreferences } from '@/contexts/preferences-context';

export type IconeOpcaoFolhaAcoes =
  | { familia: 'feather'; nome: keyof typeof Feather.glyphMap }
  | { familia: 'ionicons'; nome: keyof typeof Ionicons.glyphMap };

export interface OpcaoFolhaAcoes {
  chave: string;
  rotulo: string;
  icone: IconeOpcaoFolhaAcoes;
  aoSelecionar: () => void;
  /** Estiliza a linha em vermelho, para ações destrutivas (ex.: deletar foto). */
  destrutiva?: boolean;
}

interface FolhaAcoesProps {
  visivel: boolean;
  aoFechar: () => void;
  opcoes: OpcaoFolhaAcoes[];
  titulo?: string;
  /** Fração da altura da tela até onde a folha sobe. @default 0.5 */
  alturaFracao?: number;
}

const COR_TEXTO = '#4A3A35';
const COR_DESTRUTIVA = '#E0637A';

/**
 * Modal que sobe do rodapé até uma fração configurável da altura da tela, com uma
 * lista de opções (ícone + rótulo). Tocar na área escurecida acima dela cancela a ação.
 */
export function FolhaAcoes({ visivel, aoFechar, opcoes, titulo, alturaFracao = 0.5 }: FolhaAcoesProps) {
  const { height: alturaTela } = useWindowDimensions();
  const { bottom: espacamentoSeguro } = useSafeAreaInsets();
  const { temaEscuro } = usePreferences();

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <Pressable className="flex-1 justify-end bg-[#4A3A35]/40" onPress={aoFechar}>
        <Pressable
          className="rounded-t-[28px] bg-white px-6 pt-3 dark:bg-memento-surface-dark"
          style={{ height: alturaTela * alturaFracao, paddingBottom: espacamentoSeguro + 16 }}
          onPress={() => {}}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-memento-line dark:bg-memento-line-dark" />
          {titulo ? <AccessibleText className="mb-2 text-base font-bold text-memento-ink dark:text-memento-ink-dark">{titulo}</AccessibleText> : null}

          <View className="flex-1 justify-center">
            {opcoes.map((opcao, indice) => (
              <Pressable
                key={opcao.chave}
                onPress={() => {
                  aoFechar();
                  opcao.aoSelecionar();
                }}
                className={`flex-row items-center gap-4 py-4 ${indice < opcoes.length - 1 ? 'border-b border-memento-line dark:border-memento-line-dark' : ''}`}
                style={({ pressed }) => pressed ? { backgroundColor: temaEscuro ? '#342E32' : '#FAF5F2' } : undefined}
              >
                {opcao.icone.familia === 'feather' ? (
                  <Feather
                    name={opcao.icone.nome}
                    size={20}
                    color={opcao.destrutiva ? COR_DESTRUTIVA : temaEscuro ? '#FFF8F6' : COR_TEXTO}
                  />
                ) : (
                  <Ionicons
                    name={opcao.icone.nome}
                    size={20}
                    color={opcao.destrutiva ? COR_DESTRUTIVA : temaEscuro ? '#FFF8F6' : COR_TEXTO}
                  />
                )}
                <AccessibleText className={`text-base ${opcao.destrutiva ? 'text-memento-danger' : 'text-memento-ink dark:text-memento-ink-dark'}`}>
                  {opcao.rotulo}
                </AccessibleText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
