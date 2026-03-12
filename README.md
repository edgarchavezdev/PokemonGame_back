# Pokemon Game - Backend

Backend del juego Pokemon construido con **Express** y **Socket.IO**. Provee una API REST y comunicación en tiempo real mediante WebSocket.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd PokemonGame_back

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

## Variables de entorno

| Variable   | Descripción                        | Default       |
|------------|------------------------------------|---------------|
| `PORT`     | Puerto del servidor HTTP           | `3000`        |
| `NODE_ENV` | Entorno de ejecución               | `development` |
| `WS_PATH`  | Ruta de conexión del WebSocket     | `/ws`         |

## Uso

```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta          | Descripción               |
|--------|---------------|---------------------------|
| GET    | `/api/health` | Estado de salud del server |

## WebSocket

Conexión: `ws://localhost:3000/ws`

| Evento    | Dirección        | Descripción                      |
|-----------|------------------|----------------------------------|
| `mensaje` | Cliente → Server | Enviar un mensaje al servidor    |
| `mensaje` | Server → Cliente | Respuesta con confirmación       |

## Arquitectura

El proyecto sigue una **arquitectura limpia** con separación por capas:

```
src/
├── domain/            → Reglas de negocio puras (entidades, interfaces)
├── application/       → Casos de uso (orquestación del flujo)
├── infrastructure/    → Implementaciones técnicas
│   ├── config/        → Configuración (entorno, CORS)
│   ├── server/        → Setup de Express
│   └── websocket/     → Setup de Socket.IO
├── presentation/      → Capa de entrada
│   ├── controllers/   → Controladores HTTP
│   ├── routes/        → Definición de rutas
│   └── middlewares/    → Middlewares (logger, errores, 404)
└── server.js          → Punto de entrada
```

| Capa               | Responsabilidad                                  |
|--------------------|--------------------------------------------------|
| **Domain**         | Entidades y contratos de repositorio             |
| **Application**    | Casos de uso que orquestan la lógica de negocio  |
| **Infrastructure** | Base de datos, Express, Socket.IO, repositorios  |
| **Presentation**   | Controladores, rutas y middlewares HTTP          |

## Tech Stack

- **Runtime:** Node.js
- **HTTP:** Express 5
- **WebSocket:** Socket.IO 4
- **Entorno:** dotenv

## Scripts

| Comando        | Descripción                        |
|----------------|------------------------------------|
| `npm start`    | Inicia el servidor en producción   |
| `npm run dev`  | Inicia con nodemon (hot reload)    |
| `npm test`     | Ejecuta los tests con Jest         |

## Licencia

ISC
