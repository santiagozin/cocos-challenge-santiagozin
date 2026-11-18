# cocos-challenge-santiagozin

Prueba técnica frontend (React + TypeScript).

## Consigna

[Frontend challenge — Cocos](https://github.com/cocoscap/cocos-challenge/blob/main/frontend-challenge.md)

## Stack

- Vite + React + TypeScript
- Sass
- Oxlint
- Vitest + Testing Library
- React Query
- Redux Toolkit

## Acceso a la app

La app exige iniciar sesión. 
En la pantalla de login también se muestran las credenciales.

| Campo | Valor |
|-------|--------|
| Email | `demo@cocos.capital` |
| Contraseña | `cocos-demo` |

Rutas principales tras ingresar:

- `/instruments` — listado y búsqueda de instrumentos
- `/portfolio` — posiciones y saldos

## Variables de entorno

Copiar el ejemplo y ajustar lo necesario:

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | Base de la API dummy (default: `https://dummy-api-topaz.vercel.app`) |
| `VITE_CANDIDATE_ID` | Identificador en el header `X-Candidate-Id` (default en `.env.example`: `test`).
| `VITE_ENABLE_BUGS` | Nivel de bugs simulados en la API (`off` / valores que documente la API). |
| `VITE_INSTRUMENTS_POLL_MS` | Intervalo de actualización de precios en la tabla de instrumentos (ms). |
| `APP_PORT` | Solo Docker Compose: puerto local del contenedor (default `4173`). |

## Iniciar localmente

Requisitos: Node.js 20+ y npm.

```bash
npm install
cp .env.example .env 
npm run dev
```

Abrir la URL que imprime Vite (por defecto `http://localhost:5173`), iniciar sesión con las credenciales de demo y navegar a instrumentos o portfolio.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:run
npm run build
npm run preview
```

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | Linter |
| `npm run test` | Vitest en modo watch |
| `npm run test:run` | Vitest una sola vez (CI) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

## Docker

Requisitos: Docker y Docker Compose.

1. Copiar variables

   ```bash
   cp .env.example .env
   ```

2. Build y ejecución:

   ```bash
   docker compose up --build
   ```

3. Abrir [http://localhost:4173](http://localhost:4173) (puerto configurable con `APP_PORT` en `.env`).

Solo imagen sin Compose:

```bash
docker build -t cocos-challenge-web .
docker run --rm -p 4173:80 cocos-challenge-web
```