🌐 Language: [English](README.md) | **Português**

# Queue Master — Frontend

Um painel de gestão de filas de produção em tempo real, construído com **Next.js 16** (App Router, Turbopack). O sistema se conecta a um backend em Spring Boot para gerenciar e monitorar pedidos de produção em três filas — **impressão**, **corte de fio** e **retirada de estoque** — com atualizações em tempo real via WebSocket.

## Funcionalidades

- **Autenticação segura (padrão BFF)** — o JWT do backend é mantido em um cookie httpOnly, acessível apenas no servidor. Todas as chamadas à API passam por Server Actions do Next.js; o token nunca é exposto ao JavaScript do cliente, exceto no caso pontual e documentado da autenticação da conexão WebSocket.
- **Controle de acesso por papel** — três papéis (`ADMIN`, `INVENTOR`, `OPERATOR`) com permissões diferentes: operadores podem criar pedidos e visualizar apenas sua própria fila; admins/inventores podem criar, editar, excluir e atualizar o status de qualquer pedido.
- **Atualização das filas em tempo real** — os pedidos são transmitidos via STOMP sobre WebSocket, usando um modelo de eventos incrementais (`ORDER_CREATED`, `STATUS_CHANGED`, `ORDER_DELETED`), o que mantém a interface atualizada instantaneamente, sem polling ou recarregamento completo da lista.
- **Três filas de pedidos em um único dashboard** — alterne entre as tabelas de impressão, corte de fio e retirada de estoque em uma única tela, cada uma com suas colunas e formulário de criação específicos.
- **Filtros** — filtre pedidos por status, urgência e operador (fixo no próprio número do operador logado, no caso do papel `OPERATOR`).
- **Gestão de usuários** — CRUD completo de usuários (restrito a administradores), além de uma opção de autoatendimento para "trocar senha", disponível para todos os usuários.
- **Tema claro / escuro** — alternância de tema usando `next-themes`, com paleta de cores customizada em OKLCH.
- **Layout responsivo** — menu lateral retrátil e cabeçalho adaptado para mobile, com menu de perfil.
- **Servidor de desenvolvimento acessível na rede local** — configurável para ser acessado por outros dispositivos na mesma rede durante o desenvolvimento.

## Regras de Negócio

### Papéis (Roles)

| Papel | Descrição |
| --- | --- |
| `ADMIN` | Acesso total: gerencia usuários e pode criar/editar/excluir/atualizar o status de pedidos em qualquer fila. |
| `INVENTOR` | Mesmas permissões de pedidos do `ADMIN` (criar/editar/excluir/atualizar status em qualquer fila), porém sem gestão de usuários. |
| `OPERATOR` | Pode apenas criar pedidos e visualizar pedidos vinculados ao seu próprio `operatorNumber`. Não pode editar, excluir ou alterar o status de pedidos. |

### Pedidos

- Todo pedido pertence a uma das três filas: **impressão**, **corte de fio** ou **retirada de estoque**. Cada fila compartilha um conjunto comum de campos básicos (número da ordem de serviço, número do operador, quantidade, urgência, motivo) além de campos específicos da fila (ex.: texto de impressão para impressão, nome/comprimento do fio para corte de fio, nome do item para retirada de estoque).
- Um pedido sempre possui um dos três status: `pending` (pendente), `in_progress` (em andamento) ou `finished` (finalizado).
- Quando um `OPERATOR` cria um pedido, o número do operador fica fixo no seu próprio número e não pode ser alterado no formulário.
- `ADMIN`/`INVENTOR` podem criar pedidos em nome de qualquer operador, informando um número de operador arbitrário.
- Apenas `ADMIN`/`INVENTOR` podem atualizar o status de um pedido ou excluí-lo.
- Um `OPERATOR` só visualiza os pedidos vinculados ao seu próprio número de operador; `ADMIN`/`INVENTOR` visualizam todos os pedidos da fila.
- Alterações em pedidos (criação, atualização de status, exclusão) são transmitidas em tempo real para todos que estiverem inscritos naquela fila, mantendo todos os dashboards conectados sincronizados sem a necessidade de atualizar a página.

### Usuários

- A gestão de usuários (criar, editar, excluir, listar) é restrita ao papel `ADMIN`.
- Qualquer usuário autenticado — independente do papel — pode trocar a própria senha pelo menu de perfil, sendo necessário confirmar a senha atual.

### Autenticação & Sessão

- O backend emite um JWT no login; o frontend armazena esse token em um cookie httpOnly e nunca o expõe ao código do lado do cliente, exceto na passagem pontual para o handshake da conexão WebSocket.
- Toda página protegida exige uma sessão válida; requisições não autenticadas são redirecionadas para a tela de login.
- O papel e o número de operador do usuário logado (decodificados a partir do JWT) determinam o que a interface exibe e quais ações são permitidas — ambos validados novamente no servidor, já que as verificações no lado do cliente servem apenas para a experiência do usuário (UX).

## Telas

- **Login (Sign in)** — autentica o usuário junto ao backend e inicia a sessão.
- **Dashboard** — a tela principal de trabalho. Três botões alternam entre as filas de impressão, corte de fio e retirada de estoque, cada uma exibindo sua própria tabela atualizada em tempo real.
  - Barra de filtros na tabela com opções de **status**, **urgência** e **operador** (o filtro de operador fica fixo no próprio número do operador logado, no caso do papel `OPERATOR`).
  - Um indicador de status de conexão mostra se o WebSocket está conectando, conectado ou desconectado.
  - Um botão "Novo pedido" abre um formulário específico da fila para criação de um pedido.
  - Para `ADMIN`/`INVENTOR`, cada linha possui um menu de ações para atualizar o status do pedido ou excluí-lo.
- **Usuários** (somente `ADMIN`) — uma tabela com todos os usuários, com ações de criar, editar e excluir.
- **Menu de perfil** (cabeçalho) — exibe o nome do usuário logado, um diálogo de "trocar senha", alternância de tema (claro/escuro) e a opção de logout.
- **404 / Não encontrado** — tela padrão exibida para qualquer rota não mapeada.

## Stack Tecnológica

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Actions)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://zustand-demo.pmnd.rs) para o estado de sessão no cliente
- [TanStack Query](https://tanstack.com/query) na funcionalidade de gestão de usuários
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) para formulários e validação
- [@stomp/stompjs](https://stomp-js.github.io/stomp-websocket/) para comunicação em tempo real via STOMP/WebSocket
- [ky](https://github.com/sindresorhus/ky) como cliente HTTP
- [next-themes](https://github.com/pacocoursey/next-themes) para o modo claro/escuro

## Como Executar

### Pré-requisitos

- Node.js 20+
- O backend em Spring Boot correspondente, em execução e acessível (padrão: `http://localhost:8080`)

### Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` com base nas variáveis abaixo:

   ```bash
   NEXT_PUBLIC_API_URL="http://localhost:8080/"
   NEXT_PUBLIC_APP_NAME="Queue Master"
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD=60
   AUTH_COOKIE_SECRET="substitua-por-um-segredo-forte"
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Acessando de outros dispositivos na rede

Para acessar o servidor de desenvolvimento a partir de outra máquina na sua rede local:

1. Defina `NEXT_PUBLIC_API_URL` no `.env.local` com o IP da sua máquina na rede local (ex.: `http://192.168.0.23:8080/`), já que as conexões WebSocket são feitas diretamente pelo navegador.
2. Adicione o seu IP local em `allowedDevOrigins`, no `next.config.ts`.
3. Reinicie o servidor de desenvolvimento.

## Estrutura do Projeto

```
src/
├── app/                 # Rotas do App Router, layouts e Server Actions
├── components/          # Componentes de UI compartilhados (layout, formulários, providers)
├── config/              # Configuração de ambiente
├── features/
│   ├── orders/          # Filas de pedidos: tipos, actions, hooks, componentes
│   └── users/           # Gestão de usuários: tipos, actions, componentes
├── lib/
│   ├── auth/            # Manipulação de sessão/cookies
│   ├── http/            # Configuração do cliente HTTP
│   └── ws/              # Configuração do cliente WebSocket/STOMP
└── stores/              # Stores Zustand (estado de sessão/usuário)
```

## Scripts

| Comando          | Descrição                          |
| ---------------- | ----------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento |
| `npm run build`   | Gera o build de produção            |
| `npm run start`   | Executa o build de produção         |
| `npm run lint`    | Executa o ESLint                    |

## Licença

Este projeto é privado e não possui licença para distribuição pública.
