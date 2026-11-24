export interface ArquivoLocal {
  uri: string;
  nome?: string | null;
  tipo?: string | null;
}

/** Implementação padrão (web); no iOS/Android o Metro usa `anexar-arquivo.native.ts`.
 * Na web a uri do image-picker é um `blob:`/`data:` URL: busca o conteúdo e anexa como Blob. */
export async function anexarArquivo(formulario: FormData, campo: string, arquivo: ArquivoLocal) {
  const blob = await (await fetch(arquivo.uri)).blob();
  formulario.append(campo, blob, arquivo.nome ?? 'foto.jpg');
}
