# CSDEV-RCT-BACK-1-2569-0030 (Lost & Found API)

Backend API for a Lost & Found system, built with **Hono.js**, **TypeScript**, and **Drizzle ORM**.

- Live: https://csdev-rct-back-1-2569-0030.vercel.app

## Tech Stack

- **Runtime:** Node.js `24.x`
- **Framework:** [Hono](https://hono.dev/) (`@hono/node-server`)
- **Language:** TypeScript
- **ORM:** Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Database:** PostgreSQL (via `@neondatabase/serverless` / `pg`)
- **Validation:** Zod (`@hono/zod-validator`)
- **Auth:** JWT (`hono/jwt`), password hashing with `bcryptjs`
- **File storage:** Pinata (IPFS) + AWS S3 SDK
- **API docs:** OpenAPI doc served via `@hono/swagger-ui`
- **Dev tooling:** `tsx` (dev server), `esbuild`

## Project Structure

```
src/
├── index.ts                  # App entry point, route registration, JWT middleware
├── doc.ts                    # OpenAPI document
├── constants.ts               # Shared config values and error messages
├── type.ts                   # Shared TypeScript types (e.g. Hono ENV bindings)
├── test.ts                   # Test route
├── db/
│   ├── index.ts               # Drizzle DB client setup
│   ├── relations.ts           # Drizzle table relations
│   ├── schema/
│   │   ├── users.ts           # `users` table schema
│   │   └── notice.ts          # `notice` table schema (lost/found items)
│   └── lb/                    # Pinata client setup
├── middleware/
│   ├── authCheck.ts
│   └── jwtExpireCheck.ts
├── services/
│   ├── image.services.ts
│   ├── notice.services.ts
│   └── users.services.ts
└── api/
    ├── auth/
    │   ├── login.ts
    │   └── register.ts
    └── items/
        ├── items.get.ts
        ├── items.getId.ts
        ├── items.getImage.ts
        ├── items.getMeItem.ts
        ├── items.post.ts
        ├── items.update.ts
        └── items.delete.ts
```

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, default `gen_random_uuid()` |
| userName | varchar(255) | Unique, required |
| passwordHash | text | Required |

### `notice` (lost/found items)
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| userId | uuid | FK → `users.id`, `onDelete: cascade` |
| title | text | Required |
| type | enum | `LOST` \| `FOUND` |
| description | text | Required |
| location | text | Required |
| evenDate | date | Required |
| status | enum | `OPEN` \| `CLOSE`, default `OPEN` |
| imageUrl | text | Optional |
| imageId | text | Optional |
| owner | text | Required |
| createAt | timestamp | Default now |
| updateAt | timestamp | Default now |

## API Routes

| Method/Path | Description | Auth |
|---|---|---|
| `GET /` | Health check ("Hello Hono!") | No |
| `GET /health/pinata` | Pinata connection health check | No |
| `POST /api/auth/register` | Register a new user | No |
| `POST /api/auth/login` | Log in, returns JWT | No |
| `GET /api/items` | List items | Yes (JWT) |
| `GET /api/items/:id` | Get item by id | Yes (JWT) |
| `GET /api/items/:id/image` | Get item image | Yes (JWT) |
| `POST /api/items` | Create item | Yes (JWT) |
| `PATCH/PUT /api/items` | Update item | Yes (JWT) |
| `DELETE /api/items` | Delete item | Yes (JWT) |
| `GET /api/user/@me/items` | Get items belonging to current user | Yes (JWT) |
| `GET /doc` | OpenAPI JSON document | No |
| `GET /ui` | Swagger UI | No |

> Protected routes require a valid JWT (`Authorization` header), verified with `JWT_SECRET`, and also pass through `jwtExpireCheck` middleware.

## Environment Variables

Create a `.env` file based on `.env.example`:

```
DATABASE_URL=

PINATA_GATEWAY=
PINATA_APIKEY=
PINATA_API_SECRET=
PINATA_JWT=
PINATA_BUCKET_NAME=

JWT_SECRET=
```

## Getting Started

### Prerequisites
- Node.js `24.x`
- PostgreSQL database (e.g. Neon)
- Pinata account (for image storage)

### Installation

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env` and fill in the values.

### Run database migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Run the dev server

```bash
npm run dev
```

This runs `tsx watch src/index.ts`. The server logs the local port on startup.

### API Documentation

Once running, visit:
- `/doc` — raw OpenAPI JSON
- `/ui` — Swagger UI

## License

ISC
