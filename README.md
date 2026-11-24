# Memento

Aplicativo Expo para criar e compartilhar álbuns de fotos.

## Arquitetura

- `src/app/` contém as rotas Expo Router. Cada arquivo de rota conecta a tela ao domínio e à navegação.
- `src/features/<domínio>/` concentra componentes, hooks, regras e estado próprios de uma funcionalidade, como `albums` e `auth`.
- `src/components/` contém peças visuais reutilizáveis entre domínios, como os controles de `ui/` e a navegação.
- `src/hooks/`, `src/utils/` e `src/constants/` ficam reservados para lógica realmente compartilhada.

Use componentes funcionais com props tipadas, mantenha estado perto de quem o consome e promova uma interface para componente compartilhado quando ela tiver papel claro e for usada por mais de uma tela. As rotas devem permanecer pequenas e delegar a apresentação e as regras para `features/`.

## Estilos

O app usa NativeWind 4 com Tailwind CSS 3 para estilos universais em iOS, Android e web. A paleta Memento está em `tailwind.config.js` sob `memento-*`; prefira essas classes a valores de marca repetidos. `StyleSheet` continua adequado para estilos calculados, APIs nativas ou elementos em que classes não sejam suportadas.

## Desenvolvimento

```sh
npm install
npx expo start
```

## Integração com a API

O app consome a API em `../Memento.backend` (rotas e regras no README de lá).

- `src/services/api/` — infraestrutura: `client.ts` (fetch com Bearer, renova a sessão num 401 e repete a chamada), `sessao.ts` (tokens; o refresh token é **rotacionado**, então a renovação roda uma vez por vez), `token-storage.ts` (refresh token no `expo-secure-store`), `config.ts` (URL base) e `anexar-arquivo*.ts` (upload multipart).
- `src/features/auth/` e `src/features/albums/` — `api/` (chamadas), `context/` (estado e regras).
- Fotos ficam em container privado: use `ImagemAutenticada` (`components/ui/`), que envia o `Authorization` e usa o caminho do arquivo como `cacheKey`.
- As rotas são protegidas em `app/_layout.tsx` (`Stack.Protected`): sem sessão só existem login e cadastro.
- Link de convite: `memento://convite/{token}` (é o conteúdo do QR Code); abrir esse link fora do app cai em `app/convite/[token].tsx`.

### URL da API

Resolvida em `src/services/api/config.ts`: `EXPO_PUBLIC_API_URL` se definida; senão `localhost` (web e simulador iOS), `10.0.2.2` (emulador Android) ou o IP da máquina do Metro (celular físico).
Em celular físico a API precisa escutar fora do loopback:

```sh
dotnet run --project src/Memento.Api --urls http://0.0.0.0:5077
```

Em build de produção defina `EXPO_PUBLIC_API_URL` com a URL HTTPS da API.
