import { File } from 'expo-file-system';

export interface ArquivoLocal {
  uri: string;
  nome?: string | null;
  tipo?: string | null;
}

/**
 * Anexa um arquivo local (uri do image-picker) ao multipart.
 *
 * No Expo 57 o `fetch` global é o `expo/fetch`, que não aceita o formato clássico do React Native
 * `{ uri, name, type }` em FormData; ele só aceita string, Blob ou objetos com `bytes()`,
 * que é o caso do `File` de `expo-file-system`.
 */
export async function anexarArquivo(formulario: FormData, campo: string, arquivo: ArquivoLocal) {
  const local = new File(arquivo.uri);
  formulario.append(campo, local as unknown as Blob);
}
