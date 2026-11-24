/** Contratos da API (espelham os DTOs de `Memento.Application`; JSON em camelCase). */

export interface UsuarioDto {
  id: string;
  nomeUsuario: string;
  email: string;
  /** `yyyy-MM-dd` */
  dataNascimento: string;
  /** Caminho relativo e autenticado (`/api/arquivos/{id}`), ou `null` sem foto. */
  fotoPerfilUrl: string | null;
}

export interface TokensDto {
  accessToken: string;
  accessTokenExpiraEm: string;
  refreshToken: string;
  refreshTokenExpiraEm: string;
  usuario: UsuarioDto;
}

export interface CadastroRequest {
  nomeUsuario: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  /** `yyyy-MM-dd` */
  dataNascimento: string;
}

export interface AlbumResumoDto {
  id: string;
  nome: string;
  favorito: boolean;
  ehDono: boolean;
  totalFotos: number;
  totalMembros: number;
  capaUrl: string | null;
  criadoEm: string;
}

export interface FotoDto {
  arquivoId: string;
  url: string;
  adicionadoPorId: string;
  adicionadoEm: string;
}

export interface AlbumDetalheDto {
  id: string;
  nome: string;
  favorito: boolean;
  ehDono: boolean;
  totalMembros: number;
  capaUrl: string | null;
  criadoEm: string;
  fotos: FotoDto[];
}

export interface ConviteDto {
  link: string;
}
