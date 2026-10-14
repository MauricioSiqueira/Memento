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

Este protótipo mantém os álbuns em estado local. Autenticação, persistência e sincronização em nuvem ainda não estão conectadas.
