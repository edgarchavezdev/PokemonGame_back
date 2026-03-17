# Pokemon Game — Backend

Backend del juego Pokemon: API REST, WebSocket en tiempo real y persistencia en Firebase Firestore. Incluye flujo de lobby (unirse, listo), inicio de batalla e intercambio de ataques con registro de eventos por partida.

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Uso](#uso)
- [API REST](#api-rest)
- [WebSocket](#websocket)
- [Modelo de datos (Firestore)](#modelo-de-datos-firestore)
- [Arquitectura](#arquitectura)
- [Configuración de Firebase](#configuración-de-firebase)
- [Tech stack](#tech-stack)
- [Scripts](#scripts)
- [Licencia](#licencia)

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior  
- npm v9 o superior  
- Proyecto en [Firebase](https://console.firebase.google.com/) con Firestore (modo nativo) y API habilitada  

---

## Instalación

```bash
git clone <url-del-repositorio>
cd PokemonGame_back

npm install
cp .env.example .env
```

Edita `.env` con las credenciales de Firebase y, si aplica, la URL de la API de Pokemon (ver [Variables de entorno](#variables-de-entorno)).

---

## Variables de entorno

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `PORT` | Puerto del servidor HTTP | `3000` |
| `NODE_ENV` | Entorno (`development` / `production`) | `development` |
| `WS_PATH` | Ruta de conexión Socket.IO | `/ws` |
| `POKEMON_API_URL` | URL base de la API externa de Pokemon | *(ver código)* |
| `FIREBASE_PROJECT_ID` | ID del proyecto en Firebase | — |
| `FIREBASE_CLIENT_EMAIL` | Email de la cuenta de servicio Firebase | — |
| `FIREBASE_PRIVATE_KEY` | Llave privada (PEM, con `\n` escapados) | — |
| `FIREBASE_DATABASE_ID` | ID de la base Firestore | `(default)` |

---

## Uso

```bash
# Desarrollo (recarga automática)
npm run dev

# Producción
npm start
```

Servidor HTTP: `http://localhost:<PORT>`  
WebSocket: mismo host y puerto, path indicado por `WS_PATH` (p. ej. `/ws`).

---

## API REST

Todas las rutas están bajo el prefijo `/api`.

### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado de salud del servidor |

### Pokemon

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pokemon` | Listado de Pokemon (API externa) |
| GET | `/api/pokemon/:id` | Detalle de un Pokemon por ID |

### Lobby

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/lobby/join` | Unirse a un lobby o crear uno nuevo |
| POST | `/api/lobby/ready` | Marcar usuario como listo en su lobby |

#### POST `/api/lobby/join`

- **Body:** `{ "username": string }`
- **Respuesta:** `{ "exito": true, "datos": { "idLobby": string, "usuarios": [...] } }`
- Crea un lobby nuevo (nombre de 4 caracteres) o reutiliza el más reciente en estado `waiting`. El servidor emite por WebSocket el evento `join_lobby`.

#### POST `/api/lobby/ready`

- **Body:** `{ "username": string, "idLobby": string }`
- **Respuesta:** `{ "exito": true, "datos": { "idLobby": string, "username": string, "lobbyReady": boolean } }`
- Marca al usuario como listo. Si los dos jugadores están listos (`lobbyReady: true`), el servidor inicia la batalla y emite `battle_start` por WebSocket.

---

## WebSocket

Conexión Socket.IO en el path configurado por `WS_PATH` (p. ej. `http://localhost:3000` con `path: '/ws'`).

### Conexión (cliente)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { path: '/ws' });
```

### Eventos: Cliente → Servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `mensaje` | `any` | Mensaje genérico (el servidor responde con confirmación) |
| `join_lobby` | — | *(Reservado; el join real se hace por API y el servidor emite)* |
| `battle_start` | `{ idLobby: string }` | Solicita iniciar la batalla del lobby |
| `attack` | `{ idLobby, username, atacante, defensor }` | Envía un ataque en la batalla |

### Eventos: Servidor → Cliente

| Evento | Cuándo / Contenido |
|--------|--------------------|
| `join_lobby` | Tras `POST /api/lobby/join`: `{ idLobby, username, estatus }` |
| `ready` | Tras `POST /api/lobby/ready` (usuario listo): `{ idLobby, username }` |
| `lobby_ready` | Los dos jugadores listos; a continuación se inicia la batalla |
| `battle_start` | Batalla iniciada: `{ idLobby, batalla }` (Pokemon por jugador, turno, etc.) |
| `attack_result` | Resultado de un ataque: `{ idLobby, mensaje, username, atacante, defensor }` |
| `turn_change` | Cambio de turno: `{ idLobby, mensaje, username }` |
| `pokemon_change` | El defensor saca otro Pokemon: `{ idLobby, username, new_pokemon, old_pokemon }` |
| `battle_end` | Fin de partida: `{ idLobby, mensaje, username }` (ganador) |
| `error` | Error en un evento: `{ mensaje: string }` |

### Flujo resumido

1. Cliente llama `POST /api/lobby/join` con `username` → recibe `idLobby`; servidor emite `join_lobby`.
2. Segundo jugador hace lo mismo y se une al mismo lobby (o se crea uno nuevo según reglas).
3. Cada uno llama `POST /api/lobby/ready` con `username` e `idLobby`; servidor emite `ready` y, si ambos listos, `lobby_ready` y arranca la batalla.
4. Servidor emite `battle_start` con la configuración de la batalla.
5. Los clientes envían `attack` con `idLobby`, `username`, `atacante` y `defensor`; el servidor responde con `attack_result`, `turn_change`, `pokemon_change` o `battle_end` según corresponda.

---

## Modelo de datos (Firestore)

### Colección `lobby`

Cada documento representa un lobby (el ID del documento es el `idLobby` que usa la API y el WebSocket).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `estatus` | string | `waiting`, `complete`, `in_battle`, `finished` |
| `usuarios` | array | `[{ id, username, estatus }]` |
| `batalla` | object | Estado de la partida (usuarios, Pokemon, turno, etc.) cuando existe |
| `eventos` | array | Historial de eventos del lobby (ver abajo) |
| `creadoEn` / `actualizadoEn` | string (ISO) | Auditoría |

### Campo `eventos`

Cada elemento tiene la forma:

```json
{
  "tipo": "join | ready | battle_start | attack | turn_change | pokemon_change | battle_result",
  "datos": { ... },
  "registradoEn": "2025-03-14T12:00:00.000Z"
}
```

El servidor registra aquí cada acción relevante (unirse, listo, inicio de batalla, ataques, cambio de turno, cambio de Pokemon, fin de partida) para auditoría y replay.

---

## Arquitectura

Arquitectura en capas: dominio, aplicación, infraestructura y presentación.

```
src/
├── domain/                    # Entidades e interfaces (contratos)
├── application/               # Casos de uso
│   ├── lobby/
│   │   ├── unirse-lobby.caso-uso.js
│   │   ├── marcar-usuario-listo.caso-uso.js
│   │   └── registrar-evento-lobby.caso-uso.js
│   ├── battle/
│   │   ├── iniciar-batalla.caso-uso.js
│   │   └── ejecutar-ataque.caso-uso.js
│   └── pokemon/
│       ├── obtener-listado-pokemon.caso-uso.js
│       └── obtener-detalle-pokemon.caso-uso.js
├── infrastructure/
│   ├── config/                # Entorno, CORS, Firebase
│   ├── database/              # Firestore, repositorios (lobby, base)
│   ├── http/                  # Cliente API Pokemon
│   ├── server/                # Express
│   └── websocket/             # Socket.IO, handlers (conexión, attack, battle_start)
├── presentation/
│   ├── controllers/           # health, lobby, pokemon
│   ├── routes/
│   └── middlewares/           # logger, errores, 404
└── server.js
```

| Capa | Responsabilidad |
|------|-----------------|
| **Domain** | Entidades y contratos de repositorio |
| **Application** | Casos de uso que orquestan la lógica de negocio |
| **Infrastructure** | Firestore, Express, Socket.IO, cliente HTTP |
| **Presentation** | Controladores, rutas y middlewares HTTP |

---

## Configuración de Firebase

1. [Firebase Console](https://console.firebase.google.com/) → tu proyecto.
2. **Build** → **Firestore Database** → Crear base de datos (modo **Native**).
3. **Configuración del proyecto** → **Cuentas de servicio** → **Generar nueva clave privada**.
4. En el JSON descargado:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (en `.env` con comillas y `\n` literales).
5. Si la base no es la por defecto, configura `FIREBASE_DATABASE_ID` en `.env`.
6. En [Google Cloud Console](https://console.cloud.google.com/apis/library/firestore.googleapis.com) asegura que **Cloud Firestore API** esté habilitada para el proyecto.

No subas credenciales ni el archivo de cuenta de servicio al repositorio.

---

## Tech stack

| Categoría | Tecnología |
|-----------|------------|
| Runtime | Node.js |
| HTTP | Express 5 |
| WebSocket | Socket.IO 4 |
| Base de datos | Firebase Firestore |
| Cliente HTTP | Axios |
| Configuración | dotenv |

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor (producción) |
| `npm run dev` | Inicia con nodemon (desarrollo) |
| `npm test` | Ejecuta tests (Jest) |

---

## Licencia

Albo
