import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

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

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <Pressable style={estilos.fundo} onPress={aoFechar}>
        <Pressable
          style={[
            estilos.folha,
            { height: alturaTela * alturaFracao, paddingBottom: espacamentoSeguro + 16 },
          ]}
          onPress={() => {}}
        >
          <View style={estilos.indicadorArraste} />
          {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}

          <View style={estilos.opcoes}>
            {opcoes.map((opcao, indice) => (
              <Pressable
                key={opcao.chave}
                onPress={() => {
                  aoFechar();
                  opcao.aoSelecionar();
                }}
                style={({ pressed }) => [
                  estilos.linha,
                  indice < opcoes.length - 1 && estilos.linhaComDivisor,
                  pressed && estilos.linhaPressionada,
                ]}
              >
                {opcao.icone.familia === 'feather' ? (
                  <Feather
                    name={opcao.icone.nome}
                    size={20}
                    color={opcao.destrutiva ? COR_DESTRUTIVA : COR_TEXTO}
                  />
                ) : (
                  <Ionicons
                    name={opcao.icone.nome}
                    size={20}
                    color={opcao.destrutiva ? COR_DESTRUTIVA : COR_TEXTO}
                  />
                )}
                <Text style={[estilos.rotulo, opcao.destrutiva && estilos.rotuloDestrutivo]}>
                  {opcao.rotulo}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(74, 58, 53, 0.4)',
    justifyContent: 'flex-end',
  },
  folha: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  indicadorArraste: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EFEAE7',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: COR_TEXTO,
    marginBottom: 8,
  },
  opcoes: {
    flex: 1,
    justifyContent: 'center',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  linhaComDivisor: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEAE7',
  },
  linhaPressionada: {
    backgroundColor: '#FAF5F2',
  },
  rotulo: {
    fontSize: 16,
    color: COR_TEXTO,
  },
  rotuloDestrutivo: {
    color: COR_DESTRUTIVA,
  },
});
