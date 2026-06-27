🌐 Language: **English** | [Português](README.pt-BR.md)

# Queue Master — Frontend

A real-time production queue management dashboard built with **Next.js 16** (App Router, Turbopack). It connects to a Spring Boot backend to manage and monitor production orders across three queues — **printing**, **wire-cutting**, and **stock withdrawal** — with live updates pushed over WebSocket.

## Features

- **Secure authentication (BFF pattern)** — the backend's JWT is kept in an httpOnly, server-only cookie. All API calls go through Next.js Server Actions; the token is never exposed to client-side JavaScript except for the narrow, documented case of authenticating the WebSocket connection.
- **Role-based access control** — three roles (`ADMIN`, `INVENTOR`, `OPERATOR`) with different permissions: operators can create orders and view their own queue; admins/inventors can create, edit, delete, and update the status of any order.
- **Live queue updates** — orders are streamed in real time via STOMP over WebSocket, using a delta-event model (`ORDER_CREATED`, `STATUS_CHANGED`, `ORDER_DELETED`) so the UI updates instantly without polling or full-list refetches.
- **Three order queues in one dashboard** — switch between printing, wire-cutting, and stock-withdrawal tables from a single dashboard view, each with its own relevant columns and creation form.
- **Filtering** — filter orders by status, urgency, and operator (locked to the logged-in operator's own number for the `OPERATOR` role).
- **User management** — full CRUD for users (admin-only), plus a self-service "change password" option for every user.
- **Dark / light theme** — theme toggle backed by `next-themes`, with a custom OKLCH color palette.
- **Responsive layout** — collapsible sidebar and mobile-friendly header with a profile menu.
- **LAN-ready dev server** — configurable to be reachable from other devices on the local network during development.

## Business Rules

### Roles

| Role | Description |
| --- | --- |
| `ADMIN` | Full access: manage users, and create/edit/delete/update the status of orders in any queue. |
| `INVENTOR` | Same order permissions as `ADMIN` (create/edit/delete/update status in any queue), but without user management. |
| `OPERATOR` | Can only create orders and view orders belonging to their own `operatorNumber`. Cannot edit, delete, or change the status of orders. |

### Orders

- Every order belongs to one of three queues: **printing**, **wire-cutting**, or **stock withdrawal**. Each queue shares a common set of base fields (work order number, operator number, quantity, urgency, reason) plus queue-specific fields (e.g. print text for printing, wire name/length for wire-cutting, item name for stock withdrawal).
- An order always has one of three statuses: `pending`, `in_progress`, or `finished`.
- When an `OPERATOR` creates an order, the operator number is locked to their own and cannot be changed in the form.
- `ADMIN`/`INVENTOR` can create orders on behalf of any operator by entering an arbitrary operator number.
- Only `ADMIN`/`INVENTOR` can update an order's status or delete an order.
- An `OPERATOR` only ever sees orders tied to their own operator number; `ADMIN`/`INVENTOR` see every order in the queue.
- Order changes (create, status update, delete) are broadcast in real time to everyone subscribed to that queue, so all connected dashboards stay in sync without a page refresh.

### Users

- User management (create, edit, delete, list) is restricted to `ADMIN`.
- Any authenticated user — regardless of role — can change their own password from the profile menu, which requires confirming their current password.

### Authentication & Sessions

- The backend issues a JWT on sign-in; the frontend stores it in an httpOnly cookie and never exposes it to client-side code, except to transiently pass it into the WebSocket handshake.
- Every protected page requires a valid session; unauthenticated requests are redirected to the sign-in page.
- The logged-in user's role and operator number (decoded from the JWT) drive what the UI shows and which actions are allowed — both enforced again server-side, since client-side checks are for UX only.

## Screens

- **Sign in** — authenticates the user against the backend and starts the session.
- **Dashboard** — the main working screen. Three buttons switch between the printing, wire-cutting, and stock-withdrawal queues, each rendering its own live-updating table.
  - Table toolbar with filters for **status**, **urgency**, and **operator** (the operator filter is locked to the logged-in operator's own number for the `OPERATOR` role).
  - A connection status indicator shows whether the WebSocket is connecting, connected, or disconnected.
  - A "New order" button opens a dialog with the queue's specific form to create an order.
  - For `ADMIN`/`INVENTOR`, each row has an actions menu to update the order's status or delete it.
- **Users** (`ADMIN` only) — a table listing all users, with create, edit, and delete actions.
- **Profile menu** (header) — shows the logged-in user's name, a "change password" dialog, a theme toggle (dark/light), and the sign-out action.
- **404 / Not Found** — a default screen shown for any unmatched route.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Actions)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://zustand-demo.pmnd.rs) for client-side session state
- [TanStack Query](https://tanstack.com/query) for the users management feature
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms and validation
- [@stomp/stompjs](https://stomp-js.github.io/stomp-websocket/) for real-time STOMP/WebSocket communication
- [ky](https://github.com/sindresorhus/ky) as the HTTP client
- [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

## Getting Started

### Prerequisites

- Node.js 20+
- The companion Spring Boot backend running and reachable (default: `http://localhost:8080`)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file based on the variables below:

   ```bash
   NEXT_PUBLIC_API_URL="http://localhost:8080/"
   NEXT_PUBLIC_APP_NAME="Queue Master"
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD=60
   AUTH_COOKIE_SECRET="replace-with-a-strong-secret"
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Accessing from other devices on your network

To reach the dev server from another machine on your LAN:

1. Set `NEXT_PUBLIC_API_URL` in `.env.local` to your machine's LAN IP (e.g. `http://192.168.0.23:8080/`), since WebSocket connections are made directly from the browser.
2. Add your LAN IP to `allowedDevOrigins` in `next.config.ts`.
3. Restart the dev server.

## Project Structure

```
src/
├── app/                 # App Router routes, layouts, and Server Actions
├── components/          # Shared UI components (layout, forms, providers)
├── config/              # Environment configuration
├── features/
│   ├── orders/          # Order queues: types, actions, hooks, components
│   └── users/           # User management: types, actions, components
├── lib/
│   ├── auth/            # Session/cookie handling
│   ├── http/            # HTTP client setup
│   └── ws/              # WebSocket/STOMP client setup
└── stores/              # Zustand stores (session/user state)
```

## Scripts

| Command         | Description                       |
| --------------- | ---------------------------------- |
| `npm run dev`    | Start the development server       |
| `npm run build`  | Build the app for production       |
| `npm run start`  | Run the production build           |
| `npm run lint`   | Run ESLint                         |

## License

This project is private and not licensed for public distribution.
